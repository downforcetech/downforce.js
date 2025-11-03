import {call, compute, noop, type Io, type Task} from '@downforce/std/fn'
import {whenSome} from '@downforce/std/optional'
import type {ReactiveObserver, ReactiveWatchOptions} from '@downforce/std/reactive'
import {readReactive, watchReactive, writeReactive, type ReactiveObject, type ReactiveValuesOf} from '@downforce/std/reactive'
import type {ReadWriteSync} from '@downforce/std/store'
import {startTransition, useCallback, useEffect, useLayoutEffect, useMemo, useState, useSyncExternalStore} from 'react'
import {useRenderSignal, type RenderSignal} from './render.js'
import {useStateTransition, type StateManager, type StateWriterArg} from './state.js'

export function useReactiveState<V>(reactive: ReactiveObject<V>): StateManager<V> {
    const [value, PRIVATE_setValue] = useState(() => readReactive(reactive))

    const setValue = useCallback((value: StateWriterArg<V>) => {
        const newValue = compute(value, readReactive(reactive))

        PRIVATE_setValue(newValue)
        writeReactive(reactive, newValue)
    }, [reactive])

    useEffect(() => {
        function setValueTransition(value: V) {
            startTransition(() => {
                PRIVATE_setValue(value)
            })
        }

        const onClean = watchReactive(reactive, setValueTransition, {immediate: true})

        return onClean
    }, [reactive])

    return [value, setValue]
}

export function useReactiveValue<V>(reactive: ReactiveObject<V>): V {
    const signal = useReactiveSignal(reactive)

    return readReactive(reactive)
}

export function useReactiveValues<A extends Array<ReactiveObject<any>>>(
    reactives: readonly [...A]
): ReactiveValuesOf<A> {
    const signal = useReactiveSignals(reactives)

    const values = useMemo(() => {
        return reactives.map(readReactive) as ReactiveValuesOf<A>
    }, [reactives, signal])

    return values
}

export function useReactiveList<A extends Array<ReactiveObject<any>>>(
    reactives: readonly [...A]
): readonly [...A] {
    const signal = useReactiveSignals(reactives)

    const values = useMemo(() => {
        return [...reactives] as readonly [...A]
    }, [reactives, signal])

    return values
}

export function useReactiveMemo<A extends Array<ReactiveObject<any>>, V>(
    reactives: readonly [...A],
    computer: (...args: ReactiveValuesOf<A>) => V
): V {
    const signal = useReactiveSignals(reactives)

    const computedValue = useMemo(() => {
        return computer(...reactives.map(readReactive) as ReactiveValuesOf<A>)
    }, [reactives, computer, signal])

    return computedValue
}

export function useReactiveSelect<V, R>(
    reactive: ReactiveObject<V>,
    selector: Io<V, R>,
    deps?: undefined | ReactiveSelectorDeps,
): R
export function useReactiveSelect<V, R>(
    reactive: undefined | ReactiveObject<V>,
    selector: Io<undefined | V, R>,
    deps?: undefined | ReactiveSelectorDeps,
): undefined | R
export function useReactiveSelect<V, R>(
    reactive: undefined | ReactiveObject<V>,
    selector: Io<undefined | V, R>,
    deps?: undefined | ReactiveSelectorDeps,
): undefined | R {
    const selectedValue = selector(whenSome(reactive, readReactive))
    const [signal, setSignalTransition] = useStateTransition(selectedValue)

    const subscribe = useCallback(() => {
        if (! reactive) {
            return noop
        }

        const onClean = watchReactive(
            reactive,
            newValue => {
                startTransition(() => {
                    setSignalTransition(selector(newValue))
                })
            },
            {immediate: true},
        )

        return onClean
    }, [reactive, ...(deps ?? [])])

    const readState = useCallback(() => {
        if (! reactive) {
            return noop
        }

        return readReactive(reactive)
    }, [reactive])

    useSyncExternalStore(subscribe, readState, readState)

    return selectedValue
}

export function useReactiveStore<V>(
    read: ReadWriteSync<V>['read'],
    write: ReadWriteSync<V>['write'],
    watch: (observer: ReactiveObserver<V>, options?: undefined | ReactiveWatchOptions) => Task,
): StateManager<V> {
    const [value, PRIVATE_setValue] = useState(read())

    const setValue = useCallback((value: StateWriterArg<V>) => {
        const newValue = compute(value, read())

        PRIVATE_setValue(newValue)
        write(newValue)
    }, [read, write])

    useEffect(() => {
        function setValueTransition(value: V) {
            startTransition(() => {
                PRIVATE_setValue(value)
            })
        }

        const onClean = watch(setValueTransition, {immediate: true})

        return onClean
    }, [watch])

    return [value, setValue]
}

export function useReactiveSignal(reactive: undefined | ReactiveObject<any>): RenderSignal {
    const [signal, notifySignal] = useRenderSignal()

    // We use useLayoutEffect (instead of useEffect) to watch the reactive as soon as possible,
    // avoiding missed notifications.
    useLayoutEffect(() => {
        if (! reactive) {
            return
        }

        const onClean = watchReactive(reactive, notifySignal)

        return onClean
    }, [reactive, notifySignal])

    return signal
}

export function useReactiveSignals(
    reactives: Array<ReactiveObject<any>> | readonly [...Array<ReactiveObject<any>>],
): RenderSignal {
    const [signal, notifySignal] = useRenderSignal()

    // We use useLayoutEffect (instead of useEffect) to watch the reactives as soon as possible,
    // avoiding missed notifications.
    useLayoutEffect(() => {
        const cleaningTasks = reactives.map(it => watchReactive(it, notifySignal))

        function onClean() {
            cleaningTasks.forEach(call)
        }

        return onClean
    }, [reactives, notifySignal])

    return signal
}

export function ReactiveState<V>(props: ReactiveStateProps<V>): React.ReactNode {
    const {children, from} = props

    return children(useReactiveState(from))
}

export function ReactiveValue<V>(props: ReactiveValueProps<V>): React.ReactNode {
    const {children, of} = props

    return children(useReactiveState(of)[0])
}

export function ReactiveValues<A extends Array<ReactiveObject<any>>>(props: ReactiveValuesProps<A>): React.ReactNode {
    const {children, of} = props

    return children(useReactiveValues(of))
}

// Types ///////////////////////////////////////////////////////////////////////

export interface ReactiveStateProps<V> {
    from: ReactiveObject<V>
    children(value: StateManager<V>): React.ReactNode
}

export interface ReactiveValueProps<V> {
    of: ReactiveObject<V>
    children(value: V): React.ReactNode
}

export interface ReactiveValuesProps<A extends Array<ReactiveObject<any>>> {
    of: readonly [...A]
    children(values: ReactiveValuesOf<A>): React.ReactNode
}

export type ReactiveSelectorDeps = Array<any> | ReadonlyArray<any>

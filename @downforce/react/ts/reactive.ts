import {call, compute, noop, type Io, type Task} from '@downforce/std/fn'
import {matchSome} from '@downforce/std/optional'
import type {ReactiveObserver, ReactiveWatchOptions} from '@downforce/std/reactive'
import {readReactive, watchReactive, writeReactive, type ReactiveObject, type ReactiveValuesOf} from '@downforce/std/reactive'
import type {ReadWriteSync} from '@downforce/std/store'
import type {FIX} from '@downforce/std/type'
import {startTransition, useCallback, useEffect, useLayoutEffect, useMemo, useState, useSyncExternalStore} from 'react'
import {useFn, type HookDeps} from './hook.js'
import {useRenderSignal, type RenderSignal} from './render.js'
import type {UseStateContract, StateWriterArg} from './state.js'

export function useReactiveState<V>(reactive: ReactiveObject<V>): UseStateContract<V, V> {
    const [value, PRIVATE_setValue] = useState(() => readReactive(reactive))

    const setValue = useCallback((value: StateWriterArg<V>): V => {
        const newValue = compute(value, readReactive(reactive))

        PRIVATE_setValue(newValue)
        writeReactive(reactive, newValue)

        return newValue
    }, [reactive])

    useEffect(() => {
        const onClean = watchReactive(
            reactive,
            newValue => {
                startTransition(() => {
                    PRIVATE_setValue(newValue)
                })
            },
            {immediate: true},
        )

        return onClean as FIX<void | (() => void)>
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
    onSelect: Io<V, R>,
    deps?: undefined | HookDeps,
): R
export function useReactiveSelect<V, R>(
    reactive: undefined | ReactiveObject<V>,
    onSelect: Io<undefined | V, R>,
    deps?: undefined | HookDeps,
): undefined | R
export function useReactiveSelect<V, R>(
    reactive: undefined | ReactiveObject<V>,
    onSelect: Io<undefined | V, R>,
    deps?: undefined | HookDeps,
): undefined | R {
    const onSelectMemoized = useFn(onSelect, deps)
    const selectedValue = onSelectMemoized(matchSome(reactive, readReactive))
    const [signal, setSignal] = useState(selectedValue)

    const subscribe = useCallback(() => {
        if (! reactive) {
            return noop
        }

        const onClean = watchReactive(
            reactive,
            newValue => {
                startTransition(() => {
                    setSignal(onSelectMemoized(newValue))
                })
            },
            {immediate: true},
        )

        return onClean
    }, [reactive, onSelectMemoized])

    const readState = useCallback(() => {
        if (! reactive) {
            return
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
): UseStateContract<V, V> {
    const [value, PRIVATE_setValue] = useState(read())

    const setValue = useCallback((value: StateWriterArg<V>): V => {
        const newValue = compute(value, read())

        startTransition(() => {
            PRIVATE_setValue(newValue)
        })
        write(newValue)

        return newValue
    }, [read, write])

    useEffect(() => {
        function setValueTransition(value: V): undefined {
            startTransition(() => {
                PRIVATE_setValue(value)
            })
        }

        const onClean = watch(setValueTransition, {immediate: true})

        return onClean as FIX<void | (() => void)>
    }, [watch])

    return [value, setValue]
}

export function useReactiveSignal(reactive: undefined | ReactiveObject<any>): RenderSignal {
    const [signal, render] = useRenderSignal()

    // We use useLayoutEffect (instead of useEffect) to watch the reactive as soon as possible,
    // avoiding missed notifications.
    useLayoutEffect(() => {
        if (! reactive) {
            return
        }

        const onClean = watchReactive(
            reactive,
            () => {
                startTransition(() => {
                    render()
                })
            },
        )

        return onClean as FIX<void | (() => void)>
    }, [reactive])

    return signal
}

export function useReactiveSignals(
    reactives: Array<ReactiveObject<any>> | readonly [...Array<ReactiveObject<any>>],
): RenderSignal {
    const [signal, render] = useRenderSignal()

    // We use useLayoutEffect (instead of useEffect) to watch the reactives as soon as possible,
    // avoiding missed notifications.
    useLayoutEffect(() => {
        function notify(): undefined {
            startTransition(() => {
                render()
            })
        }

        const cleaningTasks = reactives.map(it => watchReactive(it, notify))

        function onClean() {
            cleaningTasks.forEach(call)
        }

        return onClean
    }, [reactives])

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
    children(value: UseStateContract<V, V>): React.ReactNode
}

export interface ReactiveValueProps<V> {
    of: ReactiveObject<V>
    children(value: V): React.ReactNode
}

export interface ReactiveValuesProps<A extends Array<ReactiveObject<any>>> {
    of: readonly [...A]
    children(values: ReactiveValuesOf<A>): React.ReactNode
}

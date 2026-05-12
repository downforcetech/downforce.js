import {call, compute, noop, type Io, type Task} from '@downforce/std/fn'
import type {ReactiveObserver, ReactiveWatchOptions} from '@downforce/std/reactive'
import {readReactive, watchReactive, writeReactive, type ReactiveObject, type ReactiveValuesOf} from '@downforce/std/reactive'
import type {ReadWriteSync} from '@downforce/std/store'
import {startTransition, useCallback, useLayoutEffect, useMemo, useState, useSyncExternalStore} from 'react'
import {useCallback2, type HookDeps} from './memo.js'
import {useRenderSignal, type RenderSignal} from './render.js'
import type {StateWriterArg, UseState3Contract} from './state.js'

export function useReactiveStore<V>(
    read: ReadWriteSync<V>['read'],
    write: ReadWriteSync<V>['write'],
    watch: (observer: ReactiveObserver<V>, options?: undefined | ReactiveWatchOptions) => Task,
): UseState3Contract<V> {
    const [state, PRIVATE_setState] = useState(read)

    const setState = useCallback((valueComputable: StateWriterArg<V>): V => {
        const newValue = compute(valueComputable, read())

        PRIVATE_setState(newValue)
        write(newValue)

        return newValue
    }, [read, write])

    const subscribe = useCallback(() => {
        const onClean = watch(
            newValue => {
                startTransition(() => {
                    PRIVATE_setState(newValue)
                })
            },
            {immediate: true},
        )

        return onClean
    }, [watch])

    useSyncExternalStore(subscribe, read, read)

    return [state, setState, read]
}

export function useReactiveState<V>(reactive: ReactiveObject<V>): UseState3Contract<V> {
    const read = useCallback(() => {
        return readReactive(reactive)
    }, [reactive])

    const write = useCallback((newState: V): V => {
        writeReactive(reactive, newState)

        return newState
    }, [reactive])

    const watch = useCallback((observer: ReactiveObserver<V>, options?: undefined | ReactiveWatchOptions): Task => {
        const onClean = watchReactive(reactive, observer, options)

        return onClean
    }, [reactive])

    return useReactiveStore(read, write, watch)
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
    const onSelectMemoized = useCallback2(onSelect, deps)
    const selectedValue = reactive ? onSelectMemoized(readReactive(reactive)) : undefined
    const [signal, setSignal] = useState(selectedValue)

    const getState = useCallback(() => {
        if (! reactive) {
            return
        }

        return onSelectMemoized(readReactive(reactive))
    }, [reactive, onSelectMemoized])

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

    useSyncExternalStore(subscribe, getState, getState)

    return selectedValue
}

export function useReactiveMemo<const A extends Array<ReactiveObject<any>>, V>(
    reactives: A,
    computer: (...args: ReactiveValuesOf<A>) => V
): V {
    const signal = useReactiveSignals(reactives)

    const computedValue = useMemo(() => {
        return computer(...reactives.map(readReactive) as ReactiveValuesOf<A>)
    }, [reactives, computer, signal])

    return computedValue
}

export function useReactiveValue<V>(reactive: ReactiveObject<V>): V {
    const signal = useReactiveSignal(reactive)

    return readReactive(reactive)
}

export function useReactiveValues<const A extends Array<ReactiveObject<any>>>(
    reactives: A,
): ReactiveValuesOf<A> {
    const signal = useReactiveSignals(reactives)

    const values = useMemo(() => {
        return reactives.map(readReactive) as ReactiveValuesOf<A>
    }, [reactives, signal])

    return values
}

export function useReactiveList<const A extends Array<ReactiveObject<any>>>(
    reactives: A,
): A {
    const signal = useReactiveSignals(reactives)

    const values = useMemo(() => {
        return [...reactives] as A
    }, [reactives, signal])

    return values
}

export function useReactiveSignal(reactive: undefined | ReactiveObject<any>): RenderSignal {
    const [signal, setSignal] = useRenderSignal()

    const getState = useCallback(() => {
        if (! reactive) {
            return
        }

        return readReactive(reactive)
    }, [reactive])

    const subscribe = useCallback(() => {
        if (! reactive) {
            return noop
        }

        const onClean = watchReactive(
            reactive,
            () => {
                startTransition(() => {
                    setSignal()
                })
            },
        )

        return onClean
    }, [reactive])

    useSyncExternalStore(subscribe, getState, getState)

    return signal
}

export function useReactiveSignals(
    reactives: Array<ReactiveObject<any>> | readonly [...Array<ReactiveObject<any>>],
): RenderSignal {
    const [signal, setSignal] = useRenderSignal()

    // We use useLayoutEffect (instead of useEffect) to watch the reactives as soon as possible,
    // avoiding missed notifications.
    useLayoutEffect(() => {
        const cleanTasks = reactives.map(it => watchReactive(it, () => {
            startTransition(() => {
                setSignal()
            })
        }))

        function onClean() {
            cleanTasks.forEach(call)
        }

        return onClean
    }, [reactives])

    return signal
}

export function ReactiveState<V>(props: ReactiveStateProps<V>): React.ReactNode {
    const {children, value} = props

    return children(...useReactiveState(value))
}

export function ReactiveValue<V>(props: ReactiveValueProps<V>): React.ReactNode {
    const {children, value} = props

    return children(useReactiveValue(value))
}

export function ReactiveValues<A extends Array<ReactiveObject<any>>>(props: ReactiveValuesProps<A>): React.ReactNode {
    const {children, values} = props

    return children(useReactiveValues(values))
}

// Types ///////////////////////////////////////////////////////////////////////

export interface ReactiveStateProps<V> {
    children(...args: UseState3Contract<V>): React.ReactNode
    value: ReactiveObject<V>
}

export interface ReactiveValueProps<V> {
    children(value: V): React.ReactNode
    value: ReactiveObject<V>
}

export interface ReactiveValuesProps<A extends Array<ReactiveObject<any>>> {
    children(values: ReactiveValuesOf<A>): React.ReactNode
    values: [...A]
}

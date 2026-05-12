import {call, compute, noop, type Io, type Task} from '@downforce/std/fn'
import type {ReactiveObserver, ReactiveWatchOptions} from '@downforce/std/reactive'
import {readReactive, watchReactive, writeReactive, type ReactiveObject, type ReactiveValuesOf} from '@downforce/std/reactive'
import type {ReadWriteSync} from '@downforce/std/store'
import {startTransition, useCallback, useLayoutEffect, useMemo, useSyncExternalStore} from 'react'
import {useCallback2, type HookDeps} from './memo.js'
import {useRenderSignal} from './render.js'
import type {StateWriterArg, UseState3Contract} from './state.js'

// [Note 1]:
// In React (<= 19.2) useSyncExternalStore does not support non-blocking state
// updates (transitions), but there is an ongoing research inside the React team
// for a future possible solution. There is no way of working around this problem
// at the moment that does not require opting-out from useSyncExternalStore.
// Where useSyncExternalStore is used with a startTransition+observer is just
// as memorandum stating that those codes should be implemented with non-blocking
// state updates when React will have a non-blocking useSyncExternalStore implementation.
// https://react.dev/blog/2025/04/23/react-labs-view-transitions-activity-and-more#concurrent-stores
// https://github.com/facebook/react/issues/26382
// https://github.com/reduxjs/react-redux/issues/2086

export function useReactiveStore<V>(
    read: ReadWriteSync<V>['read'],
    write: ReadWriteSync<V>['write'],
    watch: (observer: ReactiveObserver<V>, options?: undefined | ReactiveWatchOptions) => Task,
): UseState3Contract<V> {
    const setState = useCallback((stateComputable: StateWriterArg<V>): V => {
        const newState = compute(stateComputable, read())

        write(newState)

        return newState
    }, [read, write])

    const subscribe = useCallback((observer: Task) => {
        const onClean = watch(() => {
            // See [Note 1] on why we use startTransition even if
            // useSyncExternalStore does not support transitions.
            startTransition(() => {
                observer()
            })
        })

        return onClean
    }, [watch])

    const state = useSyncExternalStore(subscribe, read, read)

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

    const watch = useCallback((observer: ReactiveObserver<V>): Task => {
        const onClean = watchReactive(reactive, observer)

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

    const getState = useCallback(() => {
        if (! reactive) {
            return
        }

        return onSelectMemoized(readReactive(reactive))
    }, [reactive, onSelectMemoized])

    const subscribe = useCallback((observer: Task) => {
        if (! reactive) {
            return noop
        }

        const onClean = watchReactive(reactive, () => {
            // See [Note 1] on why we use startTransition even if
            // useSyncExternalStore does not support transitions.
            startTransition(() => {
                observer()
            })
        })

        return onClean
    }, [reactive, onSelectMemoized])

    return useSyncExternalStore(subscribe, getState, getState)
}

export function useReactiveMemo<const A extends Array<ReactiveObject<any>>, V>(
    reactives: A,
    onCompute: (...args: ReactiveValuesOf<A>) => V
): V {
    const values = useReactiveValues(reactives)

    return useMemo(() => {
        return onCompute(...values)
    }, [values, onCompute])
}

export function useReactiveValue<V>(reactive: ReactiveObject<V>): V
export function useReactiveValue<V>(reactive: undefined | ReactiveObject<V>): undefined | V
export function useReactiveValue<V>(reactive: undefined | ReactiveObject<V>): undefined | V {
    const getState = useCallback(() => {
        if (! reactive) {
            return
        }

        return readReactive(reactive)
    }, [reactive])

    const subscribe = useCallback((observer: Task) => {
        if (! reactive) {
            return noop
        }

        const onClean = watchReactive(reactive, () => {
            // See [Note 1] on why we use startTransition even if
            // useSyncExternalStore does not support transitions.
            startTransition(() => {
                observer()
            })
        })

        return onClean
    }, [reactive])

    return useSyncExternalStore(subscribe, getState, getState)
}

export function useReactiveValues<const A extends Array<ReactiveObject<any>>>(
    reactives: A,
): ReactiveValuesOf<A> {
    const reactivesList = useReactiveList(reactives)

    return useMemo(() => {
        return reactivesList.map(readReactive) as ReactiveValuesOf<A>
    }, [reactivesList])
}

export function useReactiveList<const A extends Array<ReactiveObject<any>>>(
    reactives: A,
): A {
    const [signal, setSignal] = useRenderSignal()

    const values = useMemo(() => {
        return [...reactives] as A
    }, [reactives, signal])

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

    return values
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

import {isArrayReadonly} from '@downforce/std/array'
import {createReactive, readReactive, writeReactive, type ReactiveObject} from '@downforce/std/reactive'
import {getReduxEvent, type ReduxEvent, type ReduxEventPolymorphic, type ReduxReducerState} from '@downforce/std/redux'
import type {ReadWriteSync} from '@downforce/std/store'
import {useCallback, useContext, useMemo} from 'react'
import {defineContext} from './ctx.js'
import type {HookDeps} from './hook.js'
import {useReactiveSelect} from './reactive.js'
import type {StoreDefinitionV2 as StoreDefinition, StoreDispatchV2 as StoreDispatch} from './store-v2.js'

export * from '@downforce/std/redux'
export type {StoreDefinitionV2 as StoreDefinition, StoreDispatchV2 as StoreDispatch, StoreV2Observer as StoreObserver} from './store-v2.js'

export function setupStore<S extends ReduxReducerState, A extends ReduxEvent = ReduxEvent>(
    options: StoreBoundCase1Options<S, A>,
): StoreBoundCase1Exports<S, A>
export function setupStore<S extends ReduxReducerState, A extends ReduxEvent = ReduxEvent>(
    options?: undefined | StoreBoundCase2Options<S, A>,
): StoreBoundCase2Exports<S, A>
export function setupStore<S extends ReduxReducerState, A extends ReduxEvent = ReduxEvent>(
    options?: undefined | StoreBoundCase1Options<S, A> | StoreBoundCase2Options<S, A>,
): StoreBoundCase1Exports<S, A> | StoreBoundCase2Exports<S, A> {
    if (options && 'store' in options) {
        return setupStoreUsingSingleton(options)
    }
    return setupStoreUsingContext(options)
}

export function setupStoreUsingSingleton<S extends ReduxReducerState, A extends ReduxEvent = ReduxEvent>(
    options: StoreBoundCase1Options<S, A>,
): StoreBoundCase1Exports<S, A> {
    const {store} = options

    return {
        useStore(selectorOrArgs, deps) {
            return useStore(store, selectorOrArgs, deps)
        },
    } as StoreBoundCase1Exports<S, A>
}

export function setupStoreUsingContext<S extends ReduxReducerState, A extends ReduxEvent = ReduxEvent>(
    options?: undefined | StoreBoundCase2Options<S, A>,
): StoreBoundCase2Exports<S, A> {
    const Context = options?.context ?? defineContext<StoreManager<S, A>>(options?.contextName ?? 'StoreContext')

    return {
        StoreContext: Context,
        StoreProvider(props) {
            const {children, ...otherProps} = props

            return (
                <Context value={useStoreProvider(otherProps)}>
                    {children}
                </Context>
            )
        },
        useStoreContext() {
            return useContext(Context)
        },
        useStoreProvider: useStoreProvider<S, A>,
        useStore(selectorOrArgs, deps) {
            return useStore(useContext(Context)!, selectorOrArgs, deps)
        },
    } as StoreBoundCase2Exports<S, A>
}

export function createStore<
    S extends ReduxReducerState,
    A extends ReduxEvent,
>(options: StoreDefinition<S, A>): StoreManager<S, A> {
    const {createState, reduce, observer} = options

    const state = createReactive(createState())

    function dispatch(...polymorphicArgs: ReduxEventPolymorphic): S {
        const [id, ...args] = getReduxEvent(...polymorphicArgs)

        const oldState = readReactive(state)
        const newState = reduce(oldState, ...[id, ...args] as A)

        writeReactive(state, newState)

        observer?.(id, args, newState, oldState)

        return newState
    }

    return [state, dispatch]
}

export function useStoreProvider<S extends ReduxReducerState, A extends ReduxEvent>(
    options: StoreDefinition<S, A>,
): StoreManager<S, A> {
    const store = useMemo(() => {
        return createStore(options)
    }, [])

    return store
}

export function useStore<S extends ReduxReducerState, A extends ReduxEvent = ReduxEvent>(
    store: StoreManager<S, A>,
    selector?: undefined,
    deps?: undefined,
): StoreAccessor<S, A>
export function useStore<V, S extends ReduxReducerState, A extends ReduxEvent = ReduxEvent>(
    store: StoreManager<S, A>,
    selector: StoreSelector<S, V>,
    deps?: undefined | HookDeps,
): V
export function useStore<V, S extends ReduxReducerState, A extends ReduxEvent = ReduxEvent>(
    store: StoreManager<S, A>,
    selectorWithDeps: StoreSelectorWithDeps<S, V>,
    deps?: undefined,
): V
export function useStore<V, S extends ReduxReducerState, A extends ReduxEvent = ReduxEvent>(
    store: StoreManager<S, A>,
    selectorOrArgs?: undefined | StoreSelector<S, V> | StoreSelectorWithDeps<S, V>,
    deps?: undefined | HookDeps,
): V | StoreAccessor<S, A> {
    const [state, dispatch] = store

    if (selectorOrArgs && isArrayReadonly(selectorOrArgs)) {
        const [selector, deps] = selectorOrArgs
        return useReactiveSelect(state, selector, deps)
    }
    if (selectorOrArgs) {
        const selector = selectorOrArgs
        return useReactiveSelect(state, selector, deps)
    }

    const readState = useCallback(() => {
        return readReactive(state)
    }, [state])

    return {dispatch, readState}
}

export function defineSelector<S extends object, V>(
    selector: StoreSelector<S, V>,
    deps: HookDeps,
): StoreSelectorWithDeps<S, V> {
    return [selector, deps]
}

// Types ///////////////////////////////////////////////////////////////////////

export type StoreManager<
    S extends ReduxReducerState = ReduxReducerState,
    A extends ReduxEvent = ReduxEvent,
> = [ReactiveObject<S>, StoreDispatch<S, A>]

export interface StoreAccessor<
    S extends ReduxReducerState = ReduxReducerState,
    A extends ReduxEvent = ReduxEvent,
> {
    dispatch: StoreDispatch<S, A>
    readState: StoreReader<S>
}

export type StoreReader<S extends ReduxReducerState> = ReadWriteSync<S>['read']
export type StoreSelector<S extends ReduxReducerState, V> = (state: S) => V
export type StoreSelectorWithDeps<S extends ReduxReducerState, V> = [selector: StoreSelector<S, V>, undefined | HookDeps]

export interface StoreBoundCase1Options<S extends ReduxReducerState, A extends ReduxEvent = ReduxEvent> {
    store: StoreManager<S, A>
}
export interface StoreBoundCase1Exports<S extends ReduxReducerState, A extends ReduxEvent = ReduxEvent> {
    useStore: {
        (): StoreAccessor<S, A>
        <V>(selector: StoreSelector<S, V>, deps?: undefined | HookDeps): V
        <V>(args: StoreSelectorWithDeps<S, V>): V
    }
}

export interface StoreBoundCase2Options<S extends ReduxReducerState, A extends ReduxEvent = ReduxEvent> {
    context?: undefined | React.Context<undefined | StoreManager<S, A>>
    contextName?: undefined | string
}
export interface StoreBoundCase2Exports<S extends ReduxReducerState, A extends ReduxEvent = ReduxEvent> extends StoreBoundCase1Exports<S, A> {
    StoreContext: React.Context<undefined | StoreManager<S, A>>
    StoreProvider: {
        (props: {children: React.ReactNode} & StoreDefinition<S, A>): React.JSX.Element,
    },
    useStoreContext: {
        (): undefined | StoreManager<S, A>
    }
    useStoreProvider: {
        (options: StoreDefinition<S, A>): StoreManager<S, A>
    }
}

import {isArray} from './array/array-is.js'
import {compute} from './fn/fn-compute.js'
import {areObjectsEqualShallow} from './object/object-equal.js'

export let ReducerUid = 0

export function createReduxDispatcher<S extends ReduxReducerState>(
    reducers: ReduxReducersDefinitionsList<S>,
): ReduxRootReducer<S>
export function createReduxDispatcher<S extends ReduxReducerState>(
    reducers: ReduxReducersDefinitionsDict<S>,
): ReduxRootReducer<S>
export function createReduxDispatcher<S extends ReduxReducerState>(
    reducers: ReduxReducersDefinitionsList<S> | ReduxReducersDefinitionsDict<S>,
): ReduxRootReducer<S> {
    type ActionId = ReduxReducerId
    type ActionReducer = ReduxActionReducer<S, ReduxReducerArgs>

    const reducersEntries: Array<[ActionId, ActionReducer]> = isArray(reducers)
        ? reducers
        : Object.entries(reducers)

    const reducersMap = new Map(reducersEntries)

    function reduce(state: S, actionId: ReduxReducerId, ...args: ReduxReducerArgs): S {
        const reducer = reducersMap.get(actionId)

        return reducer?.(state, ...args) ?? state
    }

    return reduce
}

export function defineReduxAction<S extends ReduxReducerState, K extends ReduxReducerId, A extends ReduxReducerArgs>(
    id: K,
    reducer: (state: S, ...args: A) => S,
): ReduxActionDefinition<S, K, A> {
    return {
        id,
        action(...args: A) {
            return [id, ...args]
        },
        reducer,
    }
}

export function defineReduxActions<R extends Record<ReduxReducerId, ReduxActionReducer<any, Array<any>>>>(
    reducers: R,
    defineId?: undefined | ((id: ReduxReducerId) => ReduxReducerId),
): {
    [key in keyof R]: ReduxActionDefinition<ReturnType<R[key]>, ReduxReducerId, ReduxActionReducerArgsOf<R[key]>>
} {
    return Object.fromEntries(
        Object.entries(reducers).map(([name, reducer]) =>
            [name, defineReduxAction(defineId?.(name) ?? name, reducer)]
        )
    ) as {
        [key in keyof R]: ReduxActionDefinition<ReturnType<R[key]>, ReduxReducerId, ReduxActionReducerArgsOf<R[key]>>
    }
}

export function exportReduxActions<A extends ReduxActionsDefinitions<any>>(
    actions: A,
): {
    [key in keyof A]: A[key]['action']
} {
    return Object.fromEntries(
        Object.entries(actions).map(([name, definition]) =>
            [name, definition.action]
        )
    ) as {
        [key in keyof A]: A[key]['action']
    }
}

export function withId<N extends ReduxReducerId, O extends ReduxReducerId = string>(name: N, format?: undefined): string
export function withId<N extends ReduxReducerId, O extends ReduxReducerId = string>(name: N, format: (name: N, uid: number) => O): O
export function withId<N extends ReduxReducerId, O extends ReduxReducerId = string>(name: N, format?: undefined | ((name: N, uid: number) => O)): string | O {
    const uid = ++ReducerUid

    return format?.(name, uid) ?? (`#${uid} ${name}` as string)
}

export function getReduxEvent(...args: ReduxEventPolymorphic): ReduxEvent {
    return isArray(args[0])
        ? args[0] as ReduxEvent // args is: [[id, ...args]]
        : args as ReduxEvent // args is: [id, ...args]
}

export function patchState<S extends ReduxReducerState>(state: S, statePatch: ReduxStatePatch<S>): S {
    const nextState = compute(statePatch, state)
    const mergedState = {...state, ...nextState}

    return areObjectsEqualShallow(state, mergedState)
        ? state
        : mergedState
}

export const ReduxReducers = {
    fromActions<S extends ReduxReducerState>(
        actions: ReduxActionsDefinitions<S>,
    ): ReduxReducersDefinitionsList<S> {
        return Object.values(actions).map((it) =>
            [it.id, it.reducer]
        )
    },
}

// Types ///////////////////////////////////////////////////////////////////////

export type ReduxReducerState = object
export type ReduxReducerId = number | string
export type ReduxReducerArgs = Array<any>

export type ReduxEvent<
    K extends ReduxReducerId = ReduxReducerId,
    A extends ReduxReducerArgs = ReduxReducerArgs,
> = [id: K, ...args: A]

export type ReduxEventPolymorphic = ReduxEvent | [ReduxEvent]

export type ReduxRootReducer<
    S extends ReduxReducerState,
> = (state: S, id: ReduxReducerId, ...args: ReduxReducerArgs) => S

export type ReduxActionReducer<
    S extends ReduxReducerState,
    A extends ReduxReducerArgs,
> = (state: S, ...args: A) => S

export interface ReduxActionDefinition<
    S extends ReduxReducerState,
    K extends ReduxReducerId,
    A extends ReduxReducerArgs,
> {
    id: K
    action(...args: A): ReduxEvent<K, A>
    reducer: ReduxActionReducer<S, A>
}

export type ReduxReducersDefinitionsDict<
    S extends ReduxReducerState,
> = Record<ReduxReducerId, ReduxActionReducer<S, ReduxReducerArgs>>

export type ReduxReducersDefinitionsList<
    S extends ReduxReducerState,
> = Array<[ReduxReducerId, ReduxActionReducer<S, ReduxReducerArgs>]>

export type ReduxActionsDefinitions<
    S extends ReduxReducerState,
> = Record<PropertyKey, ReduxActionDefinition<S, ReduxReducerId, ReduxReducerArgs>>

export type ReduxActionReducerArgsOf<R extends ReduxActionReducer<any, any>> =
    R extends (state: any, ...args: infer A) => any
        ? A
        : never

export type ReduxStatePatch<S extends ReduxReducerState> = Partial<S> | ((prevState: S) => Partial<S>)

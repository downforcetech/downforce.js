import {
    ReduxReducer,
    defineReduxAction,
    withId,
    type ReduxActionReducer,
    type ReduxCompositeReducerOfEntries,
    type ReduxReducerId,
} from '@downforce/std/redux'
import {describe, test} from 'node:test'

describe('@downforce/std/redux', (ctx) => {
    test('defineReduxAction()', (ctx) => {
        type State = {state: number}
        const state = {state: 1}

        const actionLiteral1 = defineReduxAction('a', (state: State, a: number, b: string) => state)
        const actionLiteral2 = defineReduxAction('b', (state: State, a: string, b: boolean) => state)
        const actionLiteral3 = defineReduxAction('c', (state: State, a: {kind: number}) => state)
        const actionLiteral4 = defineReduxAction('d', (state: State) => state)
        const actionLiteral5 = defineReduxAction('e', (state: State) => state)
        const actionLiteral6 = defineReduxAction('z', (state: State, o: {type: number}) => state)
        const actionGeneric1 = defineReduxAction(withId('a'), (state: State, a: number, b: string) => state)
        const actionGeneric2 = defineReduxAction(withId('b'), (state: State, a: string, b: boolean) => state)
        const actionGeneric3 = defineReduxAction(withId('c'), (state: State, a: {kind: number}) => state)
        const actionGeneric4 = defineReduxAction(withId('d'), (state: State) => state)
        const actionGeneric5 = defineReduxAction(withId('e'), (state: State) => state)
        const actionGeneric6 = defineReduxAction(withId('z'), (state: State, o: {type: number}) => state)

        const listWithLiteralIds = [
            [actionLiteral1.id, actionLiteral1.reducer],
            [actionLiteral2.id, actionLiteral2.reducer],
            [actionLiteral3.id, actionLiteral3.reducer],
            [actionLiteral4.id, actionLiteral4.reducer],
            [actionLiteral5.id, actionLiteral5.reducer],
            [actionLiteral6.id, actionLiteral6.reducer],
        ] satisfies Array<[ReduxReducerId, ReduxActionReducer<any, Array<any>>]>
        const listWithGenericIds: Array<[ReduxReducerId, ReduxActionReducer<State, Array<any>>]> = [
            [actionGeneric1.id, actionGeneric1.reducer],
            [actionGeneric2.id, actionGeneric2.reducer],
            [actionGeneric3.id, actionGeneric3.reducer],
            [actionGeneric4.id, actionGeneric4.reducer],
            [actionGeneric5.id, actionGeneric5.reducer],
            [actionGeneric6.id, actionGeneric6.reducer],
        ]

        type CompositeReducerWithLiteralIds = ReduxCompositeReducerOfEntries<typeof listWithLiteralIds>
        type CompositeReducerWithGenericIds = ReduxCompositeReducerOfEntries<typeof listWithGenericIds>
        const reducerCombinedWithLiteralIds = ReduxReducer.fromEntries(...listWithLiteralIds)
        const reducerCombinedWithGenericIds = ReduxReducer.fromEntries(...listWithGenericIds)

        reducerCombinedWithLiteralIds(state, 'a', 123, '')
        reducerCombinedWithLiteralIds(state, 'b', '', true)
        reducerCombinedWithLiteralIds(state, 'c', {kind: 123})
        reducerCombinedWithLiteralIds(state, 'd')
        reducerCombinedWithLiteralIds(state, 'e')

        reducerCombinedWithGenericIds(state, 'a', 123, '')
        reducerCombinedWithGenericIds(state, 'b', '', true)
        reducerCombinedWithGenericIds(state, 'c', {kind: 123})
        reducerCombinedWithGenericIds(state, 'd')
        reducerCombinedWithGenericIds(state, 'e')
        reducerCombinedWithGenericIds(state, 'a', null, false, '')

        // @ts-expect-error
        reducerCombinedWithLiteralIds(state, 'f')
        // @ts-expect-error
        reducerCombinedWithLiteralIds(state, 'a', null, false, '')
    })
})

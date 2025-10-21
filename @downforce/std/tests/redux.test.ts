import {
    createReduxDispatcher,
    defineReduxAction,
    defineReduxActions,
    exportReduxActions,
    ReduxReducers,
    withId,
    type ReduxReducersDefinitionsDict,
    type ReduxReducersDefinitionsList,
} from '@downforce/std/redux'
import {deepStrictEqual, notStrictEqual, strictEqual} from 'assert'
import {describe, test} from 'node:test'

describe('@downforce/std/redux', (ctx) => {
    type State = {state: string}
    const state: State = {state: ''}

    test('defineReduxAction()', (ctx) => {
        const actions = {
            a: defineReduxAction('actionId', (state: State): State => state),
            b: defineReduxAction('actionId', (state: State, a: number, b: string): State => state),
        }

        strictEqual(actions.a.id, 'actionId')
        strictEqual(actions.a.action()[0], 'actionId')

        strictEqual(actions.b.id, 'actionId')
        strictEqual(actions.b.action(123, 'abc')[0], 'actionId')
        deepStrictEqual(actions.b.action(123, 'abc').slice(1), [123, 'abc'])
    })

    test('defineReduxActions()', (ctx) => {
        const actionsWithNameId = defineReduxActions({
            a(state: State) { return {...state, state: 'state of a'} },
            b(state: State, a: number) { return {...state, state: `state of b ${a}`} },
            c(state: State, a: string, b: boolean) { return {...state, state: `state of c ${a} ${b}`} },
        })
        const actionsWithCustomId = defineReduxActions({
            a(state: State) { return {...state, state: 'state of a'} },
            b(state: State, a: number) { return {...state, state: `state of b ${a}`} },
            c(state: State, a: string, b: boolean) { return {...state, state: `state of c ${a} ${b}`} },
        }, name => `~> ${name}`)
        const actionsWithAutoId = defineReduxActions({
            a(state: State) { return {...state, state: 'state of a'} },
            b(state: State, a: number) { return {...state, state: `state of b ${a}`} },
            c(state: State, a: string, b: boolean) { return {...state, state: `state of c ${a} ${b}`} },
        }, withId)

        strictEqual(actionsWithNameId.a.id, 'a')
        strictEqual(actionsWithNameId.b.id, 'b')
        strictEqual(actionsWithCustomId.a.id, '~> a')
        strictEqual(actionsWithCustomId.b.id, '~> b')
        notStrictEqual(actionsWithAutoId.a.id, 'a')
        notStrictEqual(actionsWithAutoId.b.id, 'b')
    })

    test('exportReduxActions()', (ctx) => {
        const actions = defineReduxActions({
            a(state: State) { return {...state, state: 'state of a'} },
            b(state: State, a: number) { return {...state, state: `state of b ${a}`} },
            c(state: State, a: string, b: boolean) { return {...state, state: `state of c ${a} ${b}`} },
        })

        const Action = exportReduxActions(actions)

        strictEqual(Action.a()[0], 'a')
        strictEqual(Action.b(123)[0], 'b')
        strictEqual(Action.c('abc', true)[0], 'c')
        deepStrictEqual(Action.a().slice(1), [])
        deepStrictEqual(Action.b(123).slice(1), [123])
        deepStrictEqual(Action.c('abc', true).slice(1), ['abc', true])
    })

    test('createReduxDispatcher()', (ctx) => {
        {
            const actionLiteral = defineReduxAction('actionId', (state: State, a: number) => ({...state, state: `literal(${a})`}))
            const actionGeneric = defineReduxAction(withId('actionId'), (state: State, a: string, b: boolean) => ({...state, state: `generic(${a}, ${b})`}))

            const reducersList: ReduxReducersDefinitionsList<State> = [
                [actionLiteral.id, actionLiteral.reducer],
                [actionGeneric.id, actionGeneric.reducer],
            ]
            const reducersDict: ReduxReducersDefinitionsDict<State> = {
                [actionLiteral.id]: actionLiteral.reducer,
                [actionGeneric.id]: actionGeneric.reducer,
            }

            const reduce1 = createReduxDispatcher(reducersList)
            const reduce2 = createReduxDispatcher(reducersDict)

            deepStrictEqual(
                reduce1(state, ...actionLiteral.action(123)),
                {state: 'literal(123)'},
            )
            deepStrictEqual(
                reduce2(state, ...actionGeneric.action('abc', true)),
                {state: 'generic(abc, true)'},
            )
        }

        {
            const reducers = {
                a(state: State) { return {...state, state: 'state of a'} },
                b(state: State, a: number) { return {...state, state: `state of b ${a}`} },
                c(state: State, a: string, b: boolean) { return {...state, state: `state of c ${a} ${b}`} },
            }
            const actions = defineReduxActions(reducers)
            const reducersEntries = ReduxReducers.fromActions(actions)

            const reduceState = createReduxDispatcher(reducersEntries)

            deepStrictEqual(
                reduceState(state, ...actions.a.action()),
                {state: 'state of a'},
            )
            deepStrictEqual(
                reduceState(state, ...actions.b.action(1)),
                {state: 'state of b 1'},
            )
            deepStrictEqual(
                reduceState(state, ...actions.c.action('abc', true)),
                {state: 'state of c abc true'},
            )
        }
    })
})

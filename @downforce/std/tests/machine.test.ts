import {piped} from '@downforce/std/fn'
import {Enum} from '@downforce/std/enum'
import {defineMachine} from '@downforce/std/machine'
import Assert from 'node:assert/strict'
import {describe, test} from 'node:test'

const StateType = Enum({
    Init: 'init',
    Ready: 'ready',
})
const EventType = Enum({
    Update: 'update',
    Delete: 'delete',
})

type State =
    | {type: typeof StateType.Init}
    | {type: typeof StateType.Ready, name: string, message: string}

type Event =
    | {type: typeof EventType.Update, value: string}
    | {type: typeof EventType.Delete, id: string}

describe('@downforce/std/machine', (ctx) => {
    test('defineMachine()', (ctx) => {
        const Machine = defineMachine({
            StateType,
            EventType,

            createState(): State  {
                return {type: StateType.Init}
            },

            reduce(state, event: Event) {
                switch (state.type) {
                    case StateType.Init: {
                        switch (event.type) {
                            case EventType.Update: {
                                return {
                                    type: StateType.Ready,
                                    name: event.value,
                                    message: '',
                                }
                            }
                        }
                    }
                }
                return state
            },

            pipeline: [
                (newState, oldState, event) => {
                    if (newState.type !== StateType.Ready) {
                        return newState
                    }
                    return {...newState, message: `Hello ${newState.name}`}
                },
            ],

            effect(newState, oldState, event) {
            },
        })

        const machineState = piped(Machine.createState())
            (state => Machine.reduce(state, {type: EventType.Update, value: 'Mario'}))
        ()

        Assert.deepEqual(machineState, {
            type: StateType.Ready,
            name: 'Mario',
            message: 'Hello Mario',
        })
    })
})

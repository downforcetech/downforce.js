import type {Io, Task} from '@downforce/std/fn'
import {useCallback} from 'react'
import {useStateAccessor, type StateInit} from './state.js'

export function useMachine<S, E>(
    reduce: MachineReducer<S, E>,
    initState: MachineInitState<S>,
): MachineManager<S, E> {
    const [state, setState, getState] = useStateAccessor(initState)

    const dispatch = useCallback((event: E): S => {
        const oldState = getState()
        const newState = reduce(oldState, event)

        setState(newState)

        return newState
    }, [])

    return [state, dispatch, getState]
}

// Types ///////////////////////////////////////////////////////////////////////

export type MachineManager<S, E> = [state: S, dispatch: MachineDispatch<S, E>, getState: Task<S>]
export type MachineDispatch<S, E> = Io<E, S>
export type MachineReducer<S, E> = (state: S, event: E) => S
export type MachineInitState<S> = StateInit<S>

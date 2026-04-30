import {compute, type Io} from '@downforce/std/fn'
import {useCallback, useMemo, useRef, useState} from 'react'

export function useState1<S>(initialState: StateInit<S>): UseState1Contract<S> {
    const [state, setState, getState] = useState3(initialState)

    return useMemo(() => ({
        value: state,
        get: getState,
        set: setState,
    }), [
        state,
        getState,
        setState,
    ])
}

export function useState3<S>(initialState: StateInit<S>): UseState3Contract<S> {
    const [state, PRIVATE_setState] = useState(initialState)
    const stateRef = useRef(state)

    const getState = useCallback((): S => {
        return stateRef.current
    }, [])

    const setState = useCallback((newStateComputed: StateWriterArg<S>): S => {
        const oldState = stateRef.current
        const newState = compute(newStateComputed, oldState)

        stateRef.current = newState

        PRIVATE_setState(newState)

        return newState
    }, [])

    return [state, setState, getState]
}

/*
* Used to shallow merge a state object with a change.
*
* EXAMPLE
*
* function MyComponent(props) {
*     const [state, setState] = useState({checked: false, input: ''})
*     const patchState = useStatePatch(setState)
*
*     return (
*         <Input onChange={input => patchState({input})}/>
*     )
* }
*/
export function usePatchState<S extends object, R>(
    setState: StateWriter<S, R>,
): Io<Partial<S>, R>
export function usePatchState<S extends object, R>(
    setState: React.Dispatch<React.SetStateAction<S>>,
): Io<Partial<S>, void>
export function usePatchState<S extends object, R>(
    setState: StateWriter<S, R> | React.Dispatch<React.SetStateAction<S>>,
): Io<Partial<S>, R | void> {
    const patchState = useCallback((statePatch: Partial<S>): R | void => {
        return setState(mergeStateWith(statePatch))
    }, [setState])

    return patchState
}

/*
* Used to shallow merge a state object with a change.
*
* EXAMPLE
*
* function MyComponent(props) {
*     const [state, setState] = useState({checked: false, input: ''})
*
*     return (
*         <Input onChange={input => setState(mergeStateWith({input}))}/>
*     )
* }
*/
export function mergeStateWith<S extends object>(statePatch: Partial<S>): Io<S, S> {
    function mergeState(state: S): S {
        return {...state, ...statePatch}
    }

    return mergeState
}

// Types ///////////////////////////////////////////////////////////////////////

export type StateInit<S> = S | (() => S)
export type StateWriter<S, R> = (value: StateWriterArg<S>) => R
export type StateWriterArg<S> = React.SetStateAction<S>
export type StateReader<S> = () => S
export type UseStateContract<S, R> = [state: S, set: StateWriter<S, R>]
export type UseState1Contract<S> = {value: S, get: StateReader<S>, set: StateWriter<S, S>}
export type UseState3Contract<S> = [...UseStateContract<S, S>, get: StateReader<S>]

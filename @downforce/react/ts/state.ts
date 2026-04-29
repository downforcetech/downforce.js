import {compute, type Io} from '@downforce/std/fn'
import {useCallback, useRef, useState} from 'react'

export function useStateAccessor<S>(initialState: StateInit<S>): StateAccessorManager<S> {
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
*     const patchState = useMergeState(setState)
*
*     return (
*         <Input onChange={input => patchState({input})}/>
*     )
* }
*/
export function useMergeState<S extends object, R>(
    setState: StateWriter<S, R>,
): Io<Partial<S>, R>
export function useMergeState<S extends object, R>(
    setState: React.Dispatch<React.SetStateAction<S>>,
): Io<Partial<S>, void>
export function useMergeState<S extends object, R>(
    setState: StateWriter<S, R> | React.Dispatch<React.SetStateAction<S>>,
): Io<Partial<S>, R | void> {
    const mergeState = useCallback((statePatch: Partial<S>): R | void => {
        return setState(mergeStateWith(statePatch))
    }, [setState])

    return mergeState
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
*         <Input onChange={input => setState(mergedState({input}))}/>
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
export type StateManager<S, R> = [state: S, write: StateWriter<S, R>]
export type StateAccessorManager<S> = [state: S, write: StateWriter<S, S>, read: StateReader<S>]

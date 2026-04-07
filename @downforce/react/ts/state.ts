import {compute, type Io} from '@downforce/std/fn'
import {useCallback, useRef, useState} from 'react'

export function useStateAccessor<S>(initialState: StateInit<S>): StateAccessorManager<S> {
    const [state, PRIVATE_setState] = useState(initialState)
    const stateRef = useRef(state)

    const getState = useCallback((): S => {
        return stateRef.current
    }, [])

    const setState = useCallback((newStateComputed: StateWriterArg<S>): undefined => {
        const newState = compute(newStateComputed, stateRef.current)

        stateRef.current = newState

        PRIVATE_setState(newState)
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
export function useMergeState<S extends object>(setState: StateWriter<S> | React.Dispatch<React.SetStateAction<S>>): Io<Partial<S>, undefined> {
    const mergeState = useCallback((statePatch: Partial<S>): undefined => {
        setState(mergedState(statePatch))
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
*         <Input onChange={input => setState(merging({input}))}/>
*     )
* }
*/
export function mergedState<S extends object>(statePatch: Partial<S>): Io<S, S> {
    function mergeState(state: S): S {
        return {...state, ...statePatch}
    }

    return mergeState
}

// Types ///////////////////////////////////////////////////////////////////////

export type StateInit<S> = S | (() => S)
export type StateWriter<S> = (value: StateWriterArg<S>) => undefined
export type StateWriterArg<S> = React.SetStateAction<S>
export type StateReader<S> = () => S
export type StateManager<S> = [state: S, write: StateWriter<S>]
export type StatePatcher<S extends object> = (statePatch: Partial<S>) => undefined

export type StateAccessorManager<S> = [...StateManager<S>, read: StateReader<S>]

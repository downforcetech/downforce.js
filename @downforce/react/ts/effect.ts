import type {Fn, Task} from '@downforce/std/fn'
import type {FIX} from '@downforce/std/type'
import {useEffect, useRef} from 'react'

/*
* useEffect(fn, deps) but with inverted arguments (deps, fn) and deps as function arguments.
*/
export function useWatch<A extends Array<unknown>>(deps: readonly [...A], effect: Fn<NoInfer<A>, undefined | Task>): undefined {
    useEffect(() => {
        return effect(...deps) as void | (() => void)
    }, deps)
}

export function useWatchChange<A extends Array<unknown>>(deps: readonly [...A], effect: Fn<NoInfer<A>, undefined | Task>): undefined {
    const initRef = useRef(false)

    useEffect(() => {
        if (! initRef.current) {
            initRef.current = true
            return
        }

        return effect(...deps) as FIX<void | (() => void)>
    }, deps)
}

// Types ///////////////////////////////////////////////////////////////////////

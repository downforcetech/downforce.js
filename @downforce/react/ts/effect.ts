import type {Fn, FnArgs, Task} from '@downforce/std/fn'
import type {FIX} from '@downforce/std/type'
import {useEffect, useRef} from 'react'

/*
* useEffect(fn, deps) but with inverted arguments (deps, fn) and deps as function arguments.
*/
export function useWatch<const A extends FnArgs>(
    deps: A,
    onEffect: Fn<A, undefined | Task>,
): undefined {
    useEffect(() => {
        return onEffect(...deps) as FIX<void | (() => void)>
    }, deps)
}

/*
* useWatch(deps, fn) but skips first/initial effect.
*/
export function useWatchChange<const A extends FnArgs>(
    deps: A,
    onEffect: Fn<A, undefined | Task>,
): undefined {
    const initRef = useRef(false)

    useEffect(() => {
        if (! initRef.current) {
            initRef.current = true
            return
        }

        return onEffect(...deps) as FIX<void | (() => void)>
    }, deps)
}

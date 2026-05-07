import type {Fn, FnArgs} from '@downforce/std/fn'
import {useCallback, useLayoutEffect, useMemo, useRef} from 'react'

export const NoDeps: [] = []

/*
* Provides a constant value.
* Same of `useRef(value).current` or `useMemo(() => value, [])`.
*
* EXAMPLE
*
* function MyComponent(props) {
*     return (
*         <OtherComponent
*             flags={useConst(['a', 'b', 'c'])}
*             options={useConst({a: 1, b: 2, c: 3})}
*         />
*     )
* }
*/
export function useConst<V>(value: V): V {
    return useRef(value).current
}

/*
* useMemo(fn, deps) but with inverted arguments (deps, fn) and deps as function arguments.
*/
export function useComputed<const A extends FnArgs, R>(
    deps: A,
    onCompute: Fn<A, R>,
): R {
    return useMemo(() => onCompute(...deps), deps)
}

export function useCallback2<A extends FnArgs, R>(
    onCallback: (...args: A) => R,
    deps: undefined | HookDeps,
): (...args: A) => R {
    return deps ? useCallback(onCallback, deps) : onCallback
}

/*
* Used to invoke a closure with updated scope.
*
* EXAMPLE
*
* function MyComponent(props) {
*     const value = useMemo(() => {...}, [])
*
*     const onChange = useClosure(() => {
*         console.log(value)
*     })
*
*     return (
*         <ExpensiveMemoizedComponent onChange={onChange}/>
*     )
* }
*/
export function useClosure<A extends FnArgs, R>(
    onCallback: (...args: A) => R,
): (...args: A) => R {
    const closureRef = useRef(onCallback)

    useLayoutEffect(() => {
        closureRef.current = onCallback
    })

    const callback = useCallback((...args: A): R => {
        return closureRef.current(...args)
    }, [])

    return callback
}

export function useDeps(
    baseDeps: HookDeps,
    moreDeps: undefined | HookDeps,
): Array<unknown> {
    return moreDeps
        ? baseDeps.concat(moreDeps)
        : baseDeps as Array<unknown>
}

// Types ///////////////////////////////////////////////////////////////////////

export type HookDeps = Array<unknown> | ReadonlyArray<unknown>

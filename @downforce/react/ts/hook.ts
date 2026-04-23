import type {Fn, FnArgs, Task} from '@downforce/std/fn'
import type {FIX} from '@downforce/std/type'
import {useCallback, useEffect, useLayoutEffect, useMemo, useRef} from 'react'

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

export function useFn<A extends FnArgs, R>(
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

/*
* useMemo(fn, deps) but with inverted arguments (deps, fn) and deps as function arguments.
*/
export function useComputed<A extends FnArgs, R>(
    deps: A,
    onCompute: Fn<A, R>,
): R {
    return useMemo(() => onCompute(...deps), deps)
}

/*
* useEffect(fn, deps) but with inverted arguments (deps, fn) and deps as function arguments.
*/
export function useWatch<A extends Array<unknown>>(
    deps: readonly [...A],
    onEffect: Fn<NoInfer<A>, undefined | Task>,
): undefined {
    useEffect(() => {
        return onEffect(...deps) as void | (() => void)
    }, deps)
}

export function useWatchChange<A extends Array<unknown>>(
    deps: readonly [...A],
    onEffect: Fn<NoInfer<A>, undefined | Task>,
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

// Types ///////////////////////////////////////////////////////////////////////

export type HookDeps = Array<unknown> | ReadonlyArray<unknown>

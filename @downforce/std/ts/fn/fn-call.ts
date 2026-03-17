import type {Fn, FnArgs} from './fn-type.js'

/*
* Used for calling callbacks inside collections
* or in places where an IIFE (() => {})() is needed.
*
* EXAMPLE
* callbacks.forEach(call)
* // same of
* callbacks.forEach(it => it())
*
* EXAMPLE
* const value = call(() => {
*     if (A) return 'A'
*     if (B) return 'B'
*     return 'C'
* })
*/
export function call<R>(fn: Fn<[], R>): R
export function call<A extends FnArgs, R>(fn: Fn<A, R>, ...args: A): R
export function call<A extends FnArgs, R>(fn: Fn<A, R>, ...args: A): R {
    return fn(...args)
}

/*
* Used for calling callbacks inside collections passing default arguments.
*
* EXAMPLE
* callbacks.forEach(calling(arg1, arg2))
* // same of
* callbacks.forEach(it => it(arg1, arg2))
*/
export function calling<A extends FnArgs>(...args: A): <R>(fn: Fn<A, R>) => R {
    function call<R>(fn: Fn<A, R>): R {
        return fn(...args)
    }

    return call
}

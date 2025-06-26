import type {Fn, FnArgs} from './fn-type.js'

// Used for calling callbacks inside collections.
//
// EXAMPLE
// callbacksList.forEach(call)
// // same of

// callbacksList.forEach(it => it())
export function call<R>(fn: Fn<[], R>): R
export function call<A extends FnArgs, R>(fn: Fn<A, R>, ...args: A): R
export function call<A extends FnArgs, R>(fn: Fn<A, R>, ...args: A): R {
    return fn(...args)
}

import type {Fn, FnArgs} from './fn-type.js'

// Used for calling callbacks inside collections passing default arguments.
//
// EXAMPLE
// callbacksList.forEach(callTo(arg1, arg2))
// // same of
// callbacksList.forEach(it => it(arg1, arg2))
export function callTo<A extends FnArgs>(...args: A): <R>(fn: Fn<A, R>) => R {
    function call<R>(fn: Fn<A, R>): R {
        return fn(...args)
    }

    return call
}

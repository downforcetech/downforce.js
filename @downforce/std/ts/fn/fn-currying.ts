import {chain} from './fn-chain.js'
import {tryCatch} from './fn-try.js'
import type {Fn, FnArgs, Io, Task} from './fn-type.js'

// Used for calling callbacks inside collections passing default arguments.
//
// EXAMPLE
// callbacksList.forEach(calling(arg1, arg2))
// // same of
// callbacksList.forEach(it => it(arg1, arg2))
export function calling<A extends FnArgs>(...args: A): <R>(fn: Fn<A, R>) => R {
    function call<R>(fn: Fn<A, R>): R {
        return fn(...args)
    }

    return call
}

export function returningValue<V>(value: V): () => V {
    return () => value
}

export function returningVoid(fn: () => any): () => void {
    return () => void fn()
}

export function chaining<I>(...args: Array<Io<I, void>>): Io<I, I> {
    return (input: I) => chain(input, ...args)
}

export function tryingCatching<I, O1, O2>(
    block: Io<I, O1>,
    onCatch: Io<unknown, O2>,
    onFinally?: undefined | Task,
): Io<I, O1 | O2> {
    return (input: I) => tryCatch(() => block(input), onCatch, onFinally)
}

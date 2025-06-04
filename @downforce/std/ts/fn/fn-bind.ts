import type {FnArgs} from './fn-type.js'

// Binds a function to partial arguments without the need to specify `this`.
//
// EXAMPLE
// bind(fn, arg1)
// // same of
// fn.bind(undefined, arg1)
export function bind<A extends FnArgs, B extends FnArgs, R>(
    fn: (...allArgs: [...A, ...B]) => R,
    ...boundArgs: A
): (...otherArgs: B) => R {
    return fn.bind(undefined, ...boundArgs)
}

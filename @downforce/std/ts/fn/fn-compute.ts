import {isFunction, type Fn, type FnArgs} from '../fn.js'

export function compute<T, A extends Array<unknown>>(computable: Computable<T, A>, ...args: A): T {
    return isFunction(computable)
        ? computable(...args)
        : computable
}

// Types ///////////////////////////////////////////////////////////////////////

export type Computable<T, A extends FnArgs = []> = T | Fn<A, T>

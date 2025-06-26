import {isFunction} from './fn-is.js'
import type {Fn, FnArgs} from './fn-type.js'

export function compute<T, A extends Array<unknown>>(computable: Computable<T, A>, ...args: A): T {
    return isFunction(computable)
        ? computable(...args)
        : computable
}

// Types ///////////////////////////////////////////////////////////////////////

export type Computable<T, A extends FnArgs = []> = T | Fn<A, T>

import {createEnsureOptional, formatEnsureInvalidTypeMessage} from '../ensure.js'
import {throwInvalidType} from '../error/error-new.js'
import type {None} from '../optional/optional-type.js'
import {isFunction} from './fn-is.js'

/**
* @throws
*/
export function ensureFunction<V extends Function>(value: None | V, ctx?: any): V
export function ensureFunction(value: unknown, ctx?: any): Function
export function ensureFunction(value: unknown, ctx?: any) {
    if (! isFunction(value)) {
        return throwInvalidType(formatEnsureInvalidTypeMessage('a Function', value, ctx))
    }
    return value
}

/**
* @throws
*/
export function ensureFunctionOptional<V extends Function>(value: None | V, ctx?: any): undefined | V
export function ensureFunctionOptional(value: unknown, ctx?: any): undefined | Function
export function ensureFunctionOptional(value: unknown, ctx?: any) {
    return createEnsureOptional(ensureFunction)(value, ctx)
}

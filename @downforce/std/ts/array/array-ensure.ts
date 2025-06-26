import {createEnsureOptional, formatEnsureInvalidTypeMessage} from '../ensure.js'
import {throwInvalidType} from '../error/error-new.js'
import type {None} from '../optional/optional-type.js'
import {isArray} from './array-is.js'

/**
* @throws
*/
export function ensureArray<V extends Array<unknown>>(value: None | V, ctx?: any): V
export function ensureArray(value: unknown, ctx?: any): Array<unknown>
export function ensureArray(value: unknown, ctx?: any) {
    if (! isArray(value)) {
        return throwInvalidType(formatEnsureInvalidTypeMessage('an Array', value, ctx))
    }
    return value
}

/**
* @throws
*/
export function ensureArrayOptional<V extends Array<unknown>>(value: None | V, ctx?: any): undefined | V
export function ensureArrayOptional(value: unknown, ctx?: any): undefined | Array<unknown>
export function ensureArrayOptional(value: unknown, ctx?: any) {
    return createEnsureOptional(ensureArray)(value, ctx)
}

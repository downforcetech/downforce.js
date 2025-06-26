import {createEnsureOptional, formatEnsureInvalidTypeMessage} from '../ensure.js'
import {throwInvalidType} from '../error/error-new.js'
import type {None} from '../optional/optional-type.js'
import {isObject} from './object-is.js'

/**
* @throws
*/
export function ensureObject<V extends object = Record<PropertyKey, unknown>>(value: None | V, ctx?: any): V
export function ensureObject(value: unknown, ctx?: any): Record<PropertyKey, unknown>
export function ensureObject(value: unknown, ctx?: any): Record<PropertyKey, unknown> {
    if (! isObject(value)) {
        return throwInvalidType(formatEnsureInvalidTypeMessage('an Object', value, ctx))
    }
    return value
}

/**
* @throws
*/
export function ensureObjectOptional<V extends object = Record<PropertyKey, unknown>>(value: None | V, ctx?: any): undefined | V
export function ensureObjectOptional(value: unknown, ctx?: any): undefined | Record<PropertyKey, unknown>
export function ensureObjectOptional(value: unknown, ctx?: any): undefined | Record<PropertyKey, unknown> {
    return createEnsureOptional(ensureObject)(value, ctx)
}

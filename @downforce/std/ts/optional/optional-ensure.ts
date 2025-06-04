import {formatEnsureInvalidTypeMessage} from '../ensure.js'
import {throwInvalidType} from '../error.js'
import {isDefined, isSome, isUndefined} from './optional-is.js'
import type {None} from './optional-type.js'

/**
* @throws
*/
export function ensureSome(value: void | None, ctx?: any): never
export function ensureSome<V>(value: void | None | V, ctx?: any): V
export function ensureSome(value: unknown, ctx?: any) {
    if (! isSome(value)) {
        return throwInvalidType(formatEnsureInvalidTypeMessage('not undefined and not null', value, ctx))
    }
    return value
}

/**
* @throws
*/
export function ensureDefined(value: void | undefined, ctx?: any): never
export function ensureDefined<V>(value: void | undefined | V, ctx?: any): V
export function ensureDefined(value: unknown, ctx?: any) {
    if (! isDefined(value)) {
        return throwInvalidType(formatEnsureInvalidTypeMessage('defined', value, ctx))
    }
    return value
}

/**
* @throws
*/
export function ensureUndefined(value: unknown, ctx?: any): undefined {
    if (! isUndefined(value)) {
        return throwInvalidType(formatEnsureInvalidTypeMessage('undefined', value, ctx))
    }
    return
}

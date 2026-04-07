import {formatEnsureInvalidTypeMessage} from '../ensure.js'
import {throwInvalidType} from '../error/error-new.js'
import {isDefined, isSome, isUndefined} from './optional-is.js'
import type {Some} from './optional-type.js'

/**
* @throws
*/
export function ensureSome<V>(value: V, ctx?: any): Some<V> {
    if (! isSome(value)) {
        return throwInvalidType(formatEnsureInvalidTypeMessage('not undefined and not null', value, ctx))
    }
    return value
}

/**
* @throws
*/
export function ensureDefined<V>(value: V, ctx?: any): Exclude<V & {}, void | undefined> {
    if (! isDefined(value)) {
        return throwInvalidType(formatEnsureInvalidTypeMessage('defined', value, ctx))
    }
    return value as Exclude<V & {}, void | undefined>
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

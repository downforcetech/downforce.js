import {createEnsureOptional, formatEnsureInvalidTypeMessage} from '../ensure.js'
import {throwInvalidType} from '../error/error-new.js'
import type {None} from '../optional/optional-type.js'
import {isPromise} from './promise-is.js'

/**
* @throws
*/
export function ensurePromise<V>(value: None | Promise<V>, ctx?: any): Promise<V>
export function ensurePromise(value: unknown, ctx?: any): Promise<unknown>
export function ensurePromise(value: unknown, ctx?: any) {
    if (! isPromise(value)) {
        return throwInvalidType(formatEnsureInvalidTypeMessage('an Promise', value, ctx))
    }
    return value
}

/**
* @throws
*/
export function ensurePromiseOptional<V>(value: None | Promise<V>, ctx?: any): undefined | Promise<V>
export function ensurePromiseOptional(value: unknown, ctx?: any): undefined | Promise<unknown>
export function ensurePromiseOptional(value: unknown, ctx?: any) {
    return createEnsureOptional(ensurePromise)(value, ctx)
}

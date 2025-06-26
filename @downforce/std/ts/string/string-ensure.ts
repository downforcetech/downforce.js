import {createEnsureOptional, formatEnsureInvalidTypeMessage} from '../ensure.js'
import {throwInvalidType} from '../error/error-new.js'
import type {None} from '../optional/optional-type.js'
import {isString} from './string-is.js'

/**
* @throws
*/
export function ensureString<const V extends string>(value: None | V, ctx?: any): V
export function ensureString(value: unknown, ctx?: any): string
export function ensureString(value: unknown, ctx?: any) {
    if (! isString(value)) {
        return throwInvalidType(formatEnsureInvalidTypeMessage('a String', value, ctx))
    }
    return value
}

/**
* @throws
*/
export function ensureStringOptional<const V extends string>(value: None | V, ctx?: any): undefined | V
export function ensureStringOptional(value: unknown, ctx?: any): undefined | string
export function ensureStringOptional(value: unknown, ctx?: any) {
    return createEnsureOptional(ensureString)(value, value, ctx)
}

/**
* @throws
*/
export function ensureStringNotEmpty<const V extends string>(value: None | V, ctx?: any): V
export function ensureStringNotEmpty(value: unknown, ctx?: any): string
export function ensureStringNotEmpty(value: unknown, ctx?: any) {
    if (ensureString(value, ctx).trim() === '') {
        return throwInvalidType(formatEnsureInvalidTypeMessage('a not empty String', value, ctx))
    }
    return value
}

/**
* @throws
*/
export function ensureStringNotEmptyOptional<const V extends string>(value: None | V, ctx?: any): undefined | V
export function ensureStringNotEmptyOptional(value: unknown, ctx?: any): undefined | string
export function ensureStringNotEmptyOptional(value: unknown, ctx?: any) {
    return createEnsureOptional(ensureStringNotEmpty)(value, ctx)
}

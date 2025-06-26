import {createEnsureOptional, formatEnsureInvalidTypeMessage} from '../ensure.js'
import {throwInvalidType} from '../error/error-new.js'
import type {None} from '../optional/optional-type.js'
import {isInteger, isNumber} from './number-is.js'

/**
* @throws
*/
export function ensureNumber<const V extends number>(value: None | V, ctx?: any): V
export function ensureNumber(value: unknown, ctx?: any): number
export function ensureNumber(value: unknown, ctx?: any) {
    if (! isNumber(value)) {
        return throwInvalidType(formatEnsureInvalidTypeMessage('a Number', value, ctx))
    }
    return value
}

/**
* @throws
*/
export function ensureNumberOptional<const V extends number>(value: None | V, ctx?: any): undefined | V
export function ensureNumberOptional(value: unknown, ctx?: any): undefined | number
export function ensureNumberOptional(value: unknown, ctx?: any) {
    return createEnsureOptional(ensureNumber)(value, ctx)
}

/**
* @throws
*/
export function ensureInteger<const V extends number>(value: V, ctx?: any): V
export function ensureInteger(value: unknown, ctx?: any): number
export function ensureInteger(value: unknown, ctx?: any) {
    if (! isInteger(ensureNumber(value, ctx))) {
        return throwInvalidType(formatEnsureInvalidTypeMessage('an Integer', value, ctx))
    }
    return value
}

/**
* @throws
*/
export function ensureIntegerOptional<const V extends number>(value: None | V, ctx?: any): undefined | V
export function ensureIntegerOptional(value: unknown, ctx?: any): undefined | number
export function ensureIntegerOptional(value: unknown, ctx?: any) {
    return createEnsureOptional(ensureInteger)(value, ctx)
}

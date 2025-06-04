import {ensureArray} from '../array.js'
import {createEnsureOptional, formatEnsureInvalidTypeMessage} from '../ensure.js'
import {throwInvalidType} from '../error.js'
import type {None} from '../optional.js'

/**
* @throws
*/
export function ensureEnum<E extends Array<unknown>, V extends E[number]>(value: None | V, enumValues: E | [...E] | readonly [...E], ctx?: any): V
export function ensureEnum<E extends Array<unknown>>(value: unknown, enumValues: E | [...E] | readonly [...E], ctx?: any): E[number]
export function ensureEnum(value: unknown, enumValues: Array<unknown>, ctx?: any) {
    if (ensureArray(enumValues, `${ctx} enum`).includes(value)) {
        return value
    }
    return throwInvalidType(formatEnsureInvalidTypeMessage(`one of ${enumValues.join(' | ')}`, value, ctx))
}

/**
* @throws
*/
export function ensureEnumOptional<E, V extends E>(value: None | V, enumValues: Array<E>, ctx?: any): undefined | V
export function ensureEnumOptional<E>(value: unknown, enumValues: Array<E>, ctx?: any): undefined | E
export function ensureEnumOptional<E>(value: unknown, enumValues: Array<E>, ctx?: any) {
    return createEnsureOptional(ensureEnum)(value, enumValues, ctx)
}

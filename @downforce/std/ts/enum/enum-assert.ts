import type {None} from '../optional.js'
import {ensureEnum, ensureEnumOptional} from './enum-ensure.js'

/**
* @throws InvalidType
*/
export function assertEnum<E extends Array<unknown>, V extends E[number]>(value: None | V, enumValues: E | [...E] | readonly [...E], ctx?: any): asserts value is V
export function assertEnum<E extends Array<unknown>>(value: unknown, enumValues: E | [...E] | readonly [...E], ctx?: any): asserts value is E[number]
export function assertEnum(value: unknown, enumValues: Array<unknown>, ctx?: any) {
    ensureEnum(value, enumValues, ctx)
}

/**
* @throws InvalidType
*/
export function assertEnumOptional<E extends Array<unknown>, V extends E[number]>(value: None | V, enumValues: E | [...E] | readonly [...E], ctx?: any): asserts value is undefined | V
export function assertEnumOptional<E extends Array<unknown>>(value: unknown, enumValues: E | [...E] | readonly [...E], ctx?: any): asserts value is undefined | E[number]
export function assertEnumOptional<E>(value: unknown, enumValues: Array<E>, ctx?: any): asserts value is undefined | E {
    ensureEnumOptional(value, enumValues, ctx)
}

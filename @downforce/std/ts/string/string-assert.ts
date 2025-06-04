import {ensureString, ensureStringNotEmpty, ensureStringNotEmptyOptional, ensureStringOptional} from './string-ensure.js'

/**
* @throws InvalidType
*/
export function assertString(value: unknown, ctx?: any): asserts value is string {
    ensureString(value, ctx)
}

/**
* @throws InvalidType
*/
export function assertStringOptional(value: unknown, ctx?: any): asserts value is undefined | string {
    ensureStringOptional(value, ctx)
}

/**
* @throws InvalidType
*/
export function assertStringNotEmpty(value: unknown, ctx?: any): asserts value is string {
    ensureStringNotEmpty(value, ctx)
}

/**
* @throws InvalidType
*/
export function assertStringNotEmptyOptional(value: unknown, ctx?: any): asserts value is undefined | string {
    ensureStringNotEmptyOptional(value, ctx)
}

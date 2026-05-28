import {ensureObject, ensureObjectOptional} from './object-ensure.js'

/**
* @throws InvalidType
*/
export function assertObject(value: unknown, ctx?: any): asserts value is Record<PropertyKey, unknown> {
    ensureObject(value, ctx)
}

/**
* @throws InvalidType
*/
export function assertObjectOptional(value: unknown, ctx?: any): asserts value is undefined | Record<PropertyKey, unknown> {
    ensureObjectOptional(value, ctx)
}

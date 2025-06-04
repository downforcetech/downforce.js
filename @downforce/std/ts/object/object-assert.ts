import {ensureObject, ensureObjectOptional} from './object-ensure.js'

/**
* @throws InvalidType
*/
export function assertObject(value: unknown, ctx?: any): asserts value is Record<PropertyKey, any> {
    ensureObject(value, ctx)
}

/**
* @throws InvalidType
*/
export function assertObjectOptional(value: unknown, ctx?: any): asserts value is undefined | Record<PropertyKey, any> {
    ensureObjectOptional(value, ctx)
}

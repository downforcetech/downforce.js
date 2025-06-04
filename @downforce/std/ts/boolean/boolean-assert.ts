import {ensureBoolean, ensureBooleanOptional} from './boolean-ensure.js'

/**
* @throws InvalidType
*/
export function assertBoolean(value: unknown, ctx?: any): asserts value is boolean {
    ensureBoolean(value, ctx)
}

/**
* @throws InvalidType
*/
export function assertBooleanOptional(value: unknown, ctx?: any): asserts value is undefined | boolean {
    ensureBooleanOptional(value, ctx)
}

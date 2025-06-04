import {ensureInteger, ensureIntegerOptional, ensureNumber, ensureNumberOptional} from './number-ensure.js'

/**
* @throws InvalidType
*/
export function assertNumber(value: unknown, ctx?: any): asserts value is number {
    ensureNumber(value, ctx)
}

/**
* @throws InvalidType
*/
export function assertNumberOptional(value: unknown, ctx?: any): asserts value is undefined | number {
    ensureNumberOptional(value, ctx)
}

/**
* @throws InvalidType
*/
export function assertInteger(value: unknown, ctx?: any): asserts value is number {
    ensureInteger(value, ctx)
}

/**
* @throws InvalidType
*/
export function assertIntegerOptional(value: unknown, ctx?: any): asserts value is undefined | number {
    ensureIntegerOptional(value, ctx)
}

import {ensureArray, ensureArrayOptional} from './array-ensure.js'

/**
* @throws InvalidType
*/
export function assertArray(value: unknown, ctx?: any): asserts value is Array<unknown> {
    ensureArray(value, ctx)
}

/**
* @throws InvalidType
*/
export function assertArrayOptional(value: unknown, ctx?: any): asserts value is undefined | Array<unknown> {
    ensureArrayOptional(value, ctx)
}

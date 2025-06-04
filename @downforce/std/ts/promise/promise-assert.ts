import {ensurePromise, ensurePromiseOptional} from './promise-ensure.js'

/**
* @throws InvalidType
*/
export function assertPromise(value: unknown, ctx?: any): asserts value is Promise<unknown> {
    ensurePromise(value, ctx)
}

/**
* @throws InvalidType
*/
export function assertPromiseOptional(value: unknown, ctx?: any): asserts value is undefined | Promise<unknown> {
    ensurePromiseOptional(value, ctx)
}

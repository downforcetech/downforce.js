import {ensureFunction, ensureFunctionOptional} from './fn-ensure.js'

/**
* @throws InvalidType
*/
export function assertFunction(value: unknown, ctx?: any): asserts value is Function {
    ensureFunction(value, ctx)
}

/**
* @throws InvalidType
*/
export function assertFunctionOptional(value: unknown, ctx?: any): asserts value is undefined | Function {
    ensureFunctionOptional(value, ctx)
}

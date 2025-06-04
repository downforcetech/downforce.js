import {ensureDefined, ensureSome, ensureUndefined} from './optional-ensure.js'

/**
* @throws InvalidType
*/
export function assertDefined(value: unknown, ctx?: any): asserts value is null | {} {
    ensureDefined(value, ctx)
}

/**
* @throws InvalidType
*/
export function assertSome(value: unknown, ctx?: any): asserts value is {} {
    ensureSome(value, ctx)
}

/**
* @throws InvalidType
*/
export function assertUndefined(value: unknown, ctx?: any): asserts value is undefined {
    ensureUndefined(value, ctx)
}

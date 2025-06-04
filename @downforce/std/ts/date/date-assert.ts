import {ensureDate, ensureDateOptional, ensureDateString, ensureDateStringIsoUtc, ensureDateStringIsoUtcOptional, ensureDateStringOptional} from './date-ensure.js'

/**
* @throws InvalidType
*/
export function assertDate(value: unknown, ctx?: any): asserts value is Date {
    ensureDate(value, ctx)
}

/**
* @throws InvalidType
*/
export function assertDateOptional(value: unknown, ctx?: any): asserts value is undefined | Date {
    ensureDateOptional(value, ctx)
}

/**
* @throws
*/
export function assertDateString(value: unknown, ctx?: any): asserts value is string {
    ensureDateString(value, ctx)
}

/**
* @throws
*/
export function assertDateStringOptional(value: unknown, ctx?: any): asserts value is undefined | string {
    ensureDateStringOptional(value, ctx)
}

/**
* @throws
*/
export function assertDateStringIsoUtc(value: unknown, ctx?: any): asserts value is string {
    ensureDateStringIsoUtc(value, ctx)
}

/**
* @throws
*/
export function assertDateStringIsoUtcOptional(value: unknown, ctx?: any): asserts value is undefined | string {
    ensureDateStringIsoUtcOptional(value, ctx)
}

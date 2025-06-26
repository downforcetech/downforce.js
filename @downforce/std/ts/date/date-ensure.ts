import {createEnsureOptional, formatEnsureInvalidTypeMessage} from '../ensure.js'
import {throwInvalidType} from '../error/error-new.js'
import {assertStringNotEmpty} from '../string/string-assert.js'
import {isDate} from './date-is.js'
import {isDateString, isDateStringIsoUtc} from './date-mix.js'

/**
* @throws
*/
export function ensureDate(value: unknown, ctx?: any): Date {
    if (! isDate(value)) {
        return throwInvalidType(formatEnsureInvalidTypeMessage('a Date', value, ctx))
    }
    return value
}

/**
* @throws
*/
export function ensureDateOptional(value: unknown, ctx?: any): undefined | Date {
    return createEnsureOptional(ensureDate)(value, ctx)
}

/**
* @throws
*/
export function ensureDateString(value: unknown, ctx?: any): string {
    assertStringNotEmpty(value, ctx)

    if (! isDateString(value)) {
        return throwInvalidType(formatEnsureInvalidTypeMessage('a Date string', value, ctx))
    }

    return value
}

/**
* @throws
*/
export function ensureDateStringOptional(value: unknown, ctx?: any): undefined | string {
    return createEnsureOptional(ensureDateString)(value, ctx)
}

/**
* @throws
*/
export function ensureDateStringIsoUtc(value: unknown, ctx?: any): string {
    assertStringNotEmpty(value, ctx)

    if (! isDateStringIsoUtc(value)) {
        return throwInvalidType(formatEnsureInvalidTypeMessage('a Date as ISO string with UTC timezone', value, ctx))
    }

    return value
}

/**
* @throws
*/
export function ensureDateStringIsoUtcOptional(value: unknown, ctx?: any): undefined | string {
    return createEnsureOptional(ensureDateStringIsoUtc)(value, ctx)
}

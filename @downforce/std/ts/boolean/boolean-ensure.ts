import {createEnsureOptional, formatEnsureInvalidTypeMessage} from '../ensure.js'
import {throwInvalidType} from '../error/error-new.js'
import {isBoolean} from './boolean-is.js'

/**
* @throws
*/
export function ensureBoolean(value: unknown, ctx?: any): boolean {
    if (! isBoolean(value)) {
        return throwInvalidType(formatEnsureInvalidTypeMessage('a Boolean', value, ctx))
    }
    return value
}

/**
* @throws
*/
export function ensureBooleanOptional(value: unknown, ctx?: any): undefined | boolean {
    return createEnsureOptional(ensureBoolean)(value, ctx)
}

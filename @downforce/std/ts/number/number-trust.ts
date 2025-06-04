import {isDefined} from '../optional.js'
import {isStringNotEmpty} from '../string.js'
import {isNumber} from './number-is.js'

export function trustNumber(value: unknown): undefined | number {
    if (isNumber(value)) {
        return value
    }
    return
}

export function trustNumberLike(value: unknown): undefined | number {
    // Only strings should be parsed:
    // - null and Arrays would be parsed as 0;
    // - Symbols would throws an error.
    if (isStringNotEmpty(value)) {
        // We use not empty string check (using trim) to avoid the cast of empty
        // strings ('', ' ', '  ', ...) to 0.
        return trustNumberLike(Number(value))
    }
    return trustNumber(value)
}

export function trustInteger(value: unknown): undefined | number {
    const numberOptional = trustNumber(value)

    if (isDefined(numberOptional)) {
        return Math.trunc(numberOptional)
    }
    return
}

export function trustIntegerLike(value: unknown): undefined | number {
    return trustInteger(trustNumberLike(value))
}

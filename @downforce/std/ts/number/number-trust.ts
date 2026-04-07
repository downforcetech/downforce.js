import {isDefined} from '../optional/optional-is.js'
import {isString} from '../string/string-is.js'
import {isStringNotEmpty} from '../string/string-mix.js'
import {isNumber} from './number-is.js'

export function trustNumber(value: unknown): undefined | number {
    if (! isNumber(value)) {
        return
    }
    return value
}

export function trustNumberLike(value: unknown): undefined | number {
    // Only strings should be parsed:
    // - null and Array are parsed as 0;
    // - Symbol throws an error.
    if (isString(value) && isStringNotEmpty(value)) {
        // We use not empty string check (using trim) to avoid the cast of empty
        // strings ('', ' ', '  ', ...) to 0.
        return trustNumberLike(Number(value))
    }
    return trustNumber(value)
}

export function trustInteger(value: unknown): undefined | number {
    const numberOptional = trustNumber(value)

    if (! isDefined(numberOptional)) {
        return
    }
    return Math.trunc(numberOptional)
}

export function trustIntegerLike(value: unknown): undefined | number {
    return trustInteger(trustNumberLike(value))
}

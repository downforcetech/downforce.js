import {isNumber} from '../number.js'
import {isUndefined, type None} from '../optional.js'
import {isString} from '../string.js'

export function strictNumber<const V extends number>(value: None | number): undefined | V
export function strictNumber(value: unknown): undefined | number
export function strictNumber(value: unknown) {
    if (isNumber(value)) {
        return value
    }
    if (isString(value) && value.trim()) {
        // We trim to avoid the cast to 0 of:
        // - empty string ('');
        // - string of blank characters ('  ').
        // Only strings should be parsed:
        // - null and Arrays would be parsed as 0;
        // - Symbols would throws an error.
        return strictNumber(Number(value))
    }
    return
}

export function strictInteger<const V extends number>(value: None | number): undefined | V
export function strictInteger(value: unknown): undefined | number
export function strictInteger(value: unknown) {
    const numberOptional = strictNumber(value)

    if (isUndefined(numberOptional)) {
        return
    }
    return Math.trunc(numberOptional)
}

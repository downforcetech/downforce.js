import {isDefined, type None} from '../optional.js'
import {isStringNotEmpty} from '../string.js'
import {isNumber} from './number-is.js'

export function strictNumber<const V extends number>(value: None | number): undefined | V
export function strictNumber(value: unknown): undefined | number
export function strictNumber(value: unknown) {
    if (isNumber(value)) {
        return value
    }
    return
}

export function strictNumberLike<const V extends number>(value: None | number): undefined | V
export function strictNumberLike(value: unknown): undefined | number
export function strictNumberLike(value: unknown) {
    // Only strings should be parsed:
    // - null and Arrays would be parsed as 0;
    // - Symbols would throws an error.
    if (isStringNotEmpty(value)) {
        // We use not empty string check (using trim) to avoid the cast of empty
        // strings ('', ' ', '  ', ...) to 0.
        return strictNumberLike(Number(value))
    }
    return strictNumber(value)
}

export function strictInteger<const V extends number>(value: None | number): undefined | V
export function strictInteger(value: unknown): undefined | number
export function strictInteger(value: unknown) {
    const numberOptional = strictNumber(value)

    if (isDefined(numberOptional)) {
        return Math.trunc(numberOptional)
    }
    return
}

export function strictIntegerLike<const V extends number>(value: None | number): undefined | V
export function strictIntegerLike(value: unknown): undefined | number
export function strictIntegerLike(value: unknown) {
    return strictInteger(strictNumberLike(value))
}

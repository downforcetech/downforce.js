import {isBoolean} from '../boolean/boolean-is.js'
import {isNumber} from '../number/number-is.js'
import {isString} from './string-is.js'

export function trustString(value: unknown): undefined | string {
    if (isString(value)) {
        return value
    }
    return
}

export function trustStringNotEmpty(value: unknown): undefined | string {
    return trustString(value)?.trim() || undefined
}

export function trustStringLike(value: unknown): undefined | string {
    if (isString(value)) {
        return value
    }
    if (isNumber(value)) {
        return String(value)
    }
    if (isBoolean(value)) {
        return String(value)
    }
    return
}

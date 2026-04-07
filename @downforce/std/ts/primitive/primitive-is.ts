import {isBoolean} from '../boolean/boolean-is.js'
import {isNumber} from '../number/number-is.js'
import {isNone} from '../optional/optional-is.js'
import type {None} from '../optional/optional-type.js'
import {isString} from '../string/string-is.js'

export function isPrimitive(value: unknown): value is None | boolean | number | string {
    if (isNone(value)) {
        return true
    }
    if (isBoolean(value)) {
        return true
    }
    if (isNumber(value)) {
        return true
    }
    if (isString(value)) {
        return true
    }
    return false
}

import {isNumber} from '../number.js'
import {isString} from '../string.js'
import {isDate} from './date-is.js'

export function trustDate(value: unknown): undefined | Date {
    if (isNumber(value)) {
        return new Date(value)
    }
    if (isDate(value)) {
        return value
    }
    if (isString(value)) {
        // Date.parse() is omnivorous:
        // it accepts everything, and everything not string is returned as NaN.
        return trustDate(Date.parse(value))
    }
    return
}

import {isNumber} from '../number.js'
import {isNone} from '../optional.js'
import {isString} from '../string.js'
import {isDate} from './date-is.js'

export function strictDate(value: number | Date): Date
export function strictDate(value: unknown): undefined | Date
export function strictDate(value: unknown) {
    if (isNone(value)) {
        return
    }
    if (isDate(value)) {
        return value
    }
    if (isNumber(value)) {
        return new Date(value)
    }
    if (isString(value)) {
        // Date.parse() is omnivorous:
        // it accepts everything, and everything not string is returned as NaN.
        return strictDate(Date.parse(value))
    }
    return // Makes TypeScript happy.
}

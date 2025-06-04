import {isString} from '../string.js'

export function isDate(value: unknown): value is Date {
    if (! value) {
        return false
    }
    return value instanceof Date
}

export function isDateString(value: unknown): value is string {
    if (! value || ! isString(value) || ! Boolean(Date.parse(value))) {
        return false
    }
    return true
}

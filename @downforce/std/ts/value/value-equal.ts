import {isArray} from '../array/array-is.js'
import {isDate} from '../date/date-is.js'
import {isObject} from '../object/object-is.js'

export function areEqual<T>(first: T, second: T): boolean {
    // Remember remember the fifth of November.
    // God damn JavaScript!: NaN !== NaN

    // We don't use Object.is() because it threats -0 and +0 as different.
    if (first === second) {
        return true
    }
    if (Number.isNaN(first) && Number.isNaN(second)) {
        return true
    }
    return false
}

export function areEqualDeepStrict(first: unknown, second: unknown): boolean {
    if (areEqual(first, second)) {
        return true
    }
    if (isArray(first) && isArray(second)) {
        if (first.length !== second.length) {
            return false
        }

        const maxSize = Math.max(first.length, second.length)

        for (let idx = 0; idx < maxSize; ++idx) {
            if (! areEqualDeepStrict(first[idx], second[idx])) {
                return false
            }
        }
        return true
    }
    if (isDate(first) && isDate(second)) {
        return first.getTime() === second.getTime()
    }
    if (isObject(first) && isObject(second)) {
        const firstKeys = Object.keys(first)
        const secondKeys = Object.keys(second)

        // Strict key check.
        // We threat as different {} and {prop: undefined}.
        if (firstKeys.length !== secondKeys.length) {
            return false
        }

        const keys = new Set(firstKeys.concat(secondKeys))

        return keys.values().every(key => {
            // Strict key check.
            // We threat as different {} and {prop: undefined}.
            if ((key in first) !== (key in second)) {
                return false
            }

            type FirstKey = keyof typeof first
            type SecondKey = keyof typeof second

            return areEqualDeepStrict(first[key as FirstKey], second[key as SecondKey])
        })
    }
    return false
}

export function areEqualDeepSerializable(first: unknown, second: unknown): boolean {
    const firstString = JSON.stringify(first)
    const secondString = JSON.stringify(second)
    return firstString === secondString
}

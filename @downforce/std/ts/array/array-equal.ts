import {areEqual} from '../value/value-equal.js'

export function areArraysEqual(first: Array<unknown>, second: Array<unknown>): boolean {
    if (first.length !== second.length) {
        return false
    }

    const maxSize = Math.max(first.length, second.length)

    for (let idx = 0; idx < maxSize; ++idx) {
        if (! areEqual(first[idx], second[idx])) {
            return false
        }
    }

    return true
}

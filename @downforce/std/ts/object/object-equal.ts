import {areEqual} from '../value/value-equal.js'

export function areObjectsEqualShallow<T extends object>(firstObject: T, secondObject: T): boolean {
    if (firstObject === secondObject) {
        return true
    }

    const firstKeys = Object.keys(firstObject)
    const secondKeys = Object.keys(secondObject)
    const keys = new Set(firstKeys.concat(secondKeys))

    for (const key of keys) {
        // We threat as equal a not defined property and a property with undefined value.
        type FirstKey = keyof typeof firstObject
        type SecondKey = keyof typeof secondObject

        if (! areEqual(firstObject[key as FirstKey], secondObject[key as SecondKey])) {
            return false
        }
    }

    return true
}

export function areObjectsEqualShallowStrict<T extends object>(firstObject: T, secondObject: T): boolean {
    if (firstObject === secondObject) {
        return true
    }

    // Strict key check.
    // We threat as different {} and {prop: undefined}.
    const firstKeys = Object.keys(firstObject)
    const secondKeys = Object.keys(secondObject)

    if (firstKeys.length !== secondKeys.length) {
        return false
    }

    const keys = new Set(firstKeys.concat(secondKeys))

    for (const key of keys) {
        // Strict key check.
        // We threat as different {} and {prop: undefined}.
        if ((key in firstObject) !== (key in secondObject)) {
            return false
        }

        type FirstKey = keyof typeof firstObject
        type SecondKey = keyof typeof secondObject

        if (! areEqual(firstObject[key as FirstKey], secondObject[key as SecondKey])) {
            return false
        }
    }

    return true
}

export function areObjectsEqualShallow<T extends object>(firstObject: T, secondObject: T): boolean {
    if (firstObject === secondObject) {
        return true
    }

    const firstKeys = Object.keys(firstObject)
    const secondKeys = Object.keys(secondObject)
    const allKeys = new Set(firstKeys.concat(secondKeys))

    // Shallow equality check.
    for (const key of allKeys) {
        // A not defined property and a property with undefined value are considered equal.
        const firstValue = firstObject[key as keyof typeof firstObject]
        const secondValue = secondObject[key as keyof typeof secondObject]

        if (firstValue !== secondValue) {
            // Something changed inside the object.
            return false
        }
    }

    // Nothing changed inside the object.
    return true
}

export function areObjectsEqualShallowStrict<T extends object>(firstObject: T, secondObject: T): boolean {
    if (firstObject === secondObject) {
        return true
    }

    const firstKeys = Object.keys(firstObject)
    const secondKeys = Object.keys(secondObject)

    if (firstKeys.length !== secondKeys.length) {
        return false
    }

    const allKeys = new Set(firstKeys.concat(secondKeys))

    // Shallow equality check.
    for (const key of allKeys) {
        const keyInFirst = key in firstObject
        const keyInSecond = key in secondObject

        if (keyInFirst !== keyInSecond) {
            return false
        }

        const firstValue = firstObject[key as keyof typeof firstObject]
        const secondValue = secondObject[key as keyof typeof secondObject]

        if (firstValue !== secondValue) {
            // Something changed inside the object.
            return false
        }
    }

    // Nothing changed inside the object.
    return true
}

export function areObjectsEqualShallow<T extends object>(first: T, second: T): boolean {
    if (first === second) {
        return true
    }

    const firstKeys = Object.keys(first)
    const secondKeys = Object.keys(second)
    const allKeys = new Set([...firstKeys, ...secondKeys])

    // Shallow equality check.
    for (const key of allKeys) {
        // A not defined property and a property with undefined value are considered equal.
        const firstValue = first[key as keyof typeof first]
        const secondValue = second[key as keyof typeof second]

        if (firstValue !== secondValue) {
            // Something changed inside the object.
            return false
        }
    }

    // Nothing changed inside the object.
    return true
}

export function areObjectsEqualShallowStrict<T extends object>(first: T, second: T): boolean {
    if (first === second) {
        return true
    }

    const firstKeys = Object.keys(first)
    const secondKeys = Object.keys(second)

    if (firstKeys.length !== secondKeys.length) {
        return false
    }

    const allKeys = new Set([...firstKeys, ...secondKeys])

    // Shallow equality check.
    for (const key of allKeys) {
        const keyInFirst = key in first
        const keyInSecond = key in second

        if (keyInFirst !== keyInSecond) {
            return false
        }

        const aValue = first[key as keyof typeof first]
        const bValue = second[key as keyof typeof second]

        if (aValue !== bValue) {
            // Something changed inside the object.
            return false
        }
    }

    // Nothing changed inside the object.
    return true
}

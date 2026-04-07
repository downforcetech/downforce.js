export function isObject<V extends object = Record<PropertyKey, unknown>>(value: unknown): value is V {
    // Remember, remember, the fifth of November. God damn JavaScript!
    // typeof null === 'object'

    if (! value) {
        return false
    }

    const prototype = Object.getPrototypeOf(value)

    if (! prototype) {
        // We don't care about 'Object.create(null)'.
        return false
    }
    return prototype.constructor === Object
}

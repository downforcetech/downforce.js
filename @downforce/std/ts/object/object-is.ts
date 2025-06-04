export function isObject<V extends object = Record<PropertyKey, unknown>>(value: unknown): value is V {
    // Remember, remember, the fifth of November.
    // typeof null === 'object'. God damn JavaScript!

    if (! value) {
        return false
    }

    const proto = Object.getPrototypeOf(value)

    if (! proto) {
        // Note: We don't handle/care of Object.create(null).
        return false
    }
    if (proto.constructor !== Object) {
        return false
    }
    return true
}

export function isBoolean(value: unknown): value is boolean {
    // We don't care about 'new Boolean()'.
    return value === true || value === false
    // return typeof value === 'boolean'
}

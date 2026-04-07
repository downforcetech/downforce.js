export function isString(value: unknown): value is string {
    // We don't care about 'new String()'.
    return typeof value === 'string'
}

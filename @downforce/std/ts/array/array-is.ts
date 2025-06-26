export function isArray(value: unknown): value is Array<unknown> {
    if (! value) {
        return false
    }
    return Array.isArray(value)
}

export function isArray(value: unknown): value is Array<unknown> {
    if (! value) {
        return false
    }
    if (! Array.isArray(value)) {
        return false
    }
    return true
}

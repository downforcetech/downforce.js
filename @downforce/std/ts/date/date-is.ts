export function isDate(value: unknown): value is Date {
    if (! value) {
        return false
    }
    return value instanceof Date
}

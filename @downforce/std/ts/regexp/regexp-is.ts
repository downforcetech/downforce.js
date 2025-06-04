export function isRegExp(value: unknown): value is RegExp {
    if (! value) {
        return false
    }
    return value instanceof RegExp
}

export function isRegExp(value: unknown): value is RegExp {
    return value instanceof RegExp
}

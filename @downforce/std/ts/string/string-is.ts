export function isString(value: unknown): value is string {
    return typeof value === 'string' || value instanceof String
}

export function isStringNotEmpty(value: unknown): value is string {
    return isString(value) && Boolean(value.trim())
}

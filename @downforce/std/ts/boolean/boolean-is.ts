export function isBoolean(value: unknown): value is boolean {
    return value === true || value === false
    // return typeof value !== 'boolean'
}

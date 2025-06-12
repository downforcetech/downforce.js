export function isNumber(value: unknown): value is number {
    // We don't consider NaN a number.
    return typeof value === 'number' && ! isNaN(value)
}

export function isInteger(value: unknown): value is number {
    // return isNumber(value) && value % 1 === 0
    return Number.isInteger(value as any)
}

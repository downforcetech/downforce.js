export function isNumber(value: unknown): value is number {
    // We don't care about 'new Number()'.
    // We don't consider NaN a number.
    // We don't consider +/-Infinite a number.
    return Number.isFinite(value)
    // return typeof value === 'number' && ! Number.isNaN(value) && Number.isFinite(value)
}

export function isNumberBigInt(value: unknown): value is BigInt {
    return typeof value === 'bigint'
}

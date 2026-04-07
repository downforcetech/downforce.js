export function isArray(value: unknown): value is Array<unknown> {
    return Array.isArray(value)
}

export function isArrayReadonly(value: unknown): value is ReadonlyArray<unknown> {
    return isArray(value)
}

export function isArrayOrReadonly(value: unknown): value is Array<unknown> | ReadonlyArray<unknown> {
    return isArray(value)
}

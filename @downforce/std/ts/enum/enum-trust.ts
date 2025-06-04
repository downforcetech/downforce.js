export function trustEnum<E extends boolean | number | string>(value: unknown, enumValues: Array<E>): undefined | E {
    if (enumValues.includes(value as E)) {
        return value as E
    }
    return
}

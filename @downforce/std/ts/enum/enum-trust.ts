export function trustEnum<E>(value: unknown, enumValues: Array<E>): undefined | E {
    if (enumValues.includes(value as E)) {
        return value as E
    }
    return
}

export function isEnum<E extends Array<unknown>>(value: unknown, enumValues: E | [...E] | readonly [...E], ctx?: any): value is E[number] {
    return enumValues.includes(value)
}

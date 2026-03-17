export function isEnum<E extends Array<unknown>>(
    value: unknown,
    enumValues: E | [...E] | readonly [...E],
): value is E[number] {
    return enumValues.includes(value)
}

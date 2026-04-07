import type {EnumGeneric, UnionOf} from './enum-type.js'

export function Enum<const E extends EnumGeneric>(definition: E): E {
    return Object.freeze(definition)
}

export function Union<const E extends EnumGeneric>(definition: E): Array<E[keyof E]> {
    // UnionOfEnum<E> returns a type not expanded. Therefore we use E[keyof E] that expands.
    return Object.values(definition) as Array<UnionOf<E>>
}

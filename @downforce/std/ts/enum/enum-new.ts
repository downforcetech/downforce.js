import type {EnumGeneric, EnumOf, EnumTypeOf, UnionOf} from './enum-type.js'

export function Enum<const E extends EnumGeneric>(definition: E): EnumOf<E> {
    return Object.freeze(definition)
}

export function Union<const E extends EnumGeneric>(definition: E): UnionOf<E> {
    return Object.values(definition) as UnionOf<E>
}

export function EnumUnion<const E extends EnumGeneric>(definition: E): [E, UnionOf<E>] {
    const definitionEnum = Enum(definition)
    const definitionUnion = Union(definitionEnum)
    return [definitionEnum, definitionUnion]
}

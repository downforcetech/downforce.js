import type {EnumGeneric, EnumOf, UnionOf} from './enum-type.js'

export function Enum<const E extends EnumGeneric>(definition: E): EnumOf<E> {
    return Object.freeze(definition)
}

export function Union<const E extends EnumGeneric>(definition: E): UnionOf<E> {
    return Object.values(definition) as UnionOf<E>
}

export function EnumUnion<const E extends EnumGeneric>(definition: E): {Enum: E, Union: UnionOf<E>} {
    return {Enum: Enum(definition), Union: Union(definition)}
}

export function EnumAndUnion<const E extends EnumGeneric>(definition: E): [E, UnionOf<E>] {
    return [Enum(definition), Union(definition)]
}

// Types ///////////////////////////////////////////////////////////////////////

export type EnumGeneric = Record<PropertyKey, number | string>

export type EnumOf<V extends EnumGeneric> = V
export type UnionOf<V extends EnumGeneric | Array<unknown>> = Array<UnionTypeOf<V> & {}> // `& {}` expands the type.
export type EnumUnionOf<V extends EnumGeneric> = [EnumOf<V>, UnionOf<V>]

export type EnumTypeOf<V extends EnumGeneric | Array<unknown>> = UnionTypeOf<V>
export type UnionTypeOf<V extends EnumGeneric | Array<unknown>> =
    V extends Array<unknown>
        ? UnionTypeOfList<V>
    : V extends EnumGeneric
        ? UnionTypeOfDict<V>
    : never

export type UnionTypeOfDict<V extends EnumGeneric> = V[keyof V]
export type UnionTypeOfList<V extends Array<unknown>> = V[number]

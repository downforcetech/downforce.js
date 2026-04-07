// Types ///////////////////////////////////////////////////////////////////////

export type EnumGeneric = Record<PropertyKey, number | string>

export type UnionOf<V extends EnumGeneric | Array<unknown>> =
    V extends Array<unknown>
        ? V[number]
        : V[keyof V]

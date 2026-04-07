// Types ///////////////////////////////////////////////////////////////////////

export type Void = unknown // Sane replacement of void for return types.

export type ObjectComplete<T extends object> = {
    [P in keyof T]-?: Exclude<T[P], undefined>
}

export type ObjectPartial<T extends object> = {
    [K in keyof T]?: undefined | T[K]
}

export type ObjectPartialDeep<T extends object> = {
    [K in keyof T]?: undefined | (T[K] extends object ? ObjectPartialDeep<T[K]> : T[K])
}

export type Writable<T> = { -readonly [P in keyof T]: T[P] }
export type WritableDeep<T> = { -readonly [P in keyof T]: WritableDeep<T[P]> }

export type UnVoid<T> = T extends void ? undefined : T

// export type IfAny<V, T, F> = 0 extends (1 & V) ? T : F // Exploits any property of absorbing avery type in intersections.
// export type IfAny<V, T, F> = boolean extends (V extends never ? true : false) ? T : F // Exploits any property of being both supertype and subtype.
export type IfAny<V, T, F> = unknown extends V ? ([keyof V] extends [never] ? F : T) : F // Exploits unknown property of having no keys.
export type IfUnknown<V, T, F> = unknown extends V ? ([keyof V] extends [never] ? T : F) : F
export type IfAnyOrUnknown<V, T, F> = unknown extends V ? T : F

export type ValueOf<T> = T[keyof T]

// export type ElementOf<A extends Array<unknown>> = A[number]
export type ElementOf<A extends Array<unknown>> =
    A extends Array<infer T>
        ? T
        : never

export type Unsafe<T> =
    T extends undefined | null | boolean | number | string | symbol
        ? undefined | null | Partial<T>
    : T extends Array<infer I>
        ? undefined | null | Partial<Array<Unsafe<I>>>
    : T extends object
        ? undefined | null | Partial<{[key in keyof T]?: undefined | null | Unsafe<T[key]>}>
    : unknown

export type UnsafeObject<T extends object> = NonNullable<Unsafe<T>>

export type Untrusted<T> =
    T extends Array<infer I>
        ? undefined | null | boolean | number | string | symbol | object | {} | Partial<Array<Untrusted<I>>>
    : T extends object
        ? undefined | null | boolean | number | string | symbol | object | {} | Partial<{[key in keyof T]?: Untrusted<T[key]>}>
    : unknown

export type StringAutocompleted = string & {}

export type Prettify<T> = {} & {
    [K in keyof T]: T[K]
}

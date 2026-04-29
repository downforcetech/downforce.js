// Types ///////////////////////////////////////////////////////////////////////

export type Void = unknown // Sane replacement of void for return types.
export type ExcludeVoid<V> = V extends void ? undefined : V

export type Complete<O extends object> = {
    [P in keyof O]-?: Exclude<O[P], undefined>
}

export type Options<O extends object> = {
    [K in keyof O]?: undefined | O[K]
}
export type OptionsDeep<O extends object> = {
    [K in keyof O]?: undefined | (O[K] extends object ? OptionsDeep<O[K]> : O[K])
}

export type Writable<T> = { -readonly [P in keyof T]: T[P] }
export type WritableDeep<T> = { -readonly [P in keyof T]: WritableDeep<T[P]> }

// export type IfAny<V, T, F> = 0 extends (1 & V) ? T : F // Exploits any property of absorbing avery type in intersections.
// export type IfAny<V, T, F> = boolean extends (V extends never ? true : false) ? T : F // Exploits any property of being both supertype and subtype.
export type IfAny<V, T, F> = unknown extends V ? ([keyof V] extends [never] ? F : T) : F // Exploits unknown property of having no keys.
export type IfUnknown<V, T, F> = unknown extends V ? ([keyof V] extends [never] ? T : F) : F
export type IfAnyOrUnknown<V, T, F> = unknown extends V ? T : F

export type ValueOf<O extends object> = O[keyof O]
export type ElementOf<A extends Array<unknown>> = A extends Array<infer E> ? E : never
// export type ElementOf<A extends Array<unknown>> = A[number]

export type Unsafe<V> =
    V extends undefined | null | boolean | number | string | symbol
        ? undefined | null | Partial<V>
    : V extends Array<infer I>
        ? undefined | null | Partial<Array<Unsafe<I>>>
    : V extends object
        ? undefined | null | Partial<{[key in keyof V]?: undefined | null | Unsafe<V[key]>}>
    : unknown

export type UnsafeObject<O extends object> = NonNullable<Unsafe<O>>

export type Untrusted<V> =
    V extends Array<infer I>
        ? undefined | null | boolean | number | string | symbol | object | {} | Partial<Array<Untrusted<I>>>
    : V extends object
        ? undefined | null | boolean | number | string | symbol | object | {} | Partial<{[key in keyof V]?: Untrusted<V[key]>}>
    : unknown

export type StringAutocomplete = string & {}

export type Prettify<V> = {} & {
    [K in keyof V]: V[K]
}

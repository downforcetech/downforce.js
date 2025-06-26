// Types ///////////////////////////////////////////////////////////////////////

export type Optional<T> = None | T
export type None = undefined | null
export type Some<T> = NonNullable<T>

export type SomeOf<V> = V extends {} ? V : (V & {})

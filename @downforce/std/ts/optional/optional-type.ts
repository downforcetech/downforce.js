// Types ///////////////////////////////////////////////////////////////////////

// NOTE about void.
// Void in TypeScript is broken: it should behave like unknown but
// - when used as type in an assignment behaves like undefined
// - when used as return type of a function implementation behaves like undefined
// - when used as return type of a function type definition behaves like unknown
// Because void propagates quite easily using promises, pipes, mapping arrays,
// we should have a way to handle it consistently.
// There is no right choice here given the broken void behavior, so we choose
// to follow the TypeScript control flow logic, which best accomodate most of
// use cases.
// Given following examples, we decided to exclude void from Some value.
//   function returnNothing(): void {
//       return undefined // Fine.
//   }
//   function returnNull(): void {
//       return null // Error.
//   }
//   const nothing1: void = undefined // Fine.
//   const nothing2: void = null // Error.
//   const voidOrNumber = undefined as void | number
//   if (voidOrNumber) { // void | number
//       voidOrNumber // number
//   }
//   if (voidOrNumber !== undefined) { // void | number
//       voidOrNumber // number
//   }
// The only left case is
//   const returnAnything: (() => void) = () => 10
// but we think that void should not be used in these cases, given the wicked void behavior.
// Instead you should write that code as
//   const returnAnythingIDontCare: (() => unknown) = () => 10
// If you are not convinced of how broken void is in TypeScript, watch this
//   const returnAnything:           (() => void)          = () => 10 // Valid.
//   const returnAnythingAndString:  (() => void | string) = () => 10 // Invalid.

export type Optional<V> = None | V
export type None = undefined | null
export type Some<V> = Exclude<V & {}, void | None> // '& {}' casts unknown.
// export type Some<V> = Exclude<V, void | None> & {} // Works well but does not expand the returned type.
// export type Some<V> = V extends {} ? V : (V & {}) // Broken. Doesn't work with void.
// export type Some<V> = NonNullable<V> // Broken. Doesn't work with [].filter(isSome)

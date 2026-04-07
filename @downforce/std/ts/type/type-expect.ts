export function expectType<T>(input: T): T {
    return input
}

export function expectTypeEqual<T>(first: T, second: T): undefined {
}

// Types ///////////////////////////////////////////////////////////////////////

export type EqualTypes<A, B> =
    [A] extends [B]
        ? [B] extends [A]
            ? true
            : false
        : false

export type AssertType<T extends true> = never

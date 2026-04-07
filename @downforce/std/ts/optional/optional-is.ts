import type {None, Some} from './optional-type.js'

// export function isSome(value: unknown): value is {} // Overloads break Array.filter(isSome).
// export function isSome(value: unknown): value is {} // Breaks ensureSome() and filterSome().
export function isSome<V>(value: V): value is Some<V> {
    return ! isNone(value)
}

export function isNone(value: unknown): value is None {
    return isUndefined(value) || isNull(value)
}

export function isNull(value: unknown): value is null {
    return value === null
}

export function isUndefined(value: unknown): value is undefined {
    return value === void undefined
    // return typeof value === 'undefined'
}

export function isDefined<V>(value: V): value is Exclude<V & {}, void | undefined> | Extract<V, null> {
    // For the explanation of why we exclude void, see optional/optional-type.ts and Some type.
    return ! isUndefined(value)
}

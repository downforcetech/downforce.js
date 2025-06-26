import type {None, SomeOf} from './optional-type.js'

export function isDefined<V>(value: void | undefined | V): value is V {
    return ! isUndefined(value)
}

export function isNone(value: unknown): value is None {
    return isUndefined(value) || isNull(value)
}

export function isNull(value: unknown): value is null {
    return value === null
}

// export function isSome(value: unknown): value is {} // Overloads break `Array.filter(isSome)`.
export function isSome<V>(value: V): value is SomeOf<V> {
    return ! isNone(value)
}

export function isUndefined(value: unknown): value is undefined {
    return value === void undefined
}

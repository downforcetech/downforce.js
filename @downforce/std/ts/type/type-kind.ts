import type {Io} from '../fn/fn-type.js'
import {TypeIs} from './type-is.js'

export const TypeKind: {
    array: Io<unknown, boolean>
    boolean: Io<unknown, boolean>
    date: Io<unknown, boolean>
    defined: Io<unknown, boolean>
    error: Io<unknown, boolean>
    function: Io<unknown, boolean>
    integer: Io<unknown, boolean>
    iterator: Io<unknown, boolean>
    none: Io<unknown, boolean>
    null: Io<unknown, boolean>
    number: Io<unknown, boolean>
    object: Io<unknown, boolean>
    promise: Io<unknown, boolean>
    regexp: Io<unknown, boolean>
    result: Io<unknown, boolean>
    some: Io<unknown, boolean>
    string: Io<unknown, boolean>
    symbol: Io<unknown, boolean>
    undefined: Io<unknown, boolean>
} = {
    array: TypeIs.isArray,
    boolean: TypeIs.isBoolean,
    date: TypeIs.isDate,
    defined: TypeIs.isDefined,
    error: TypeIs.isError,
    function: TypeIs.isFunction,
    integer: TypeIs.isInteger,
    iterator: TypeIs.isIterator,
    none: TypeIs.isNone,
    null: TypeIs.isNull,
    number: TypeIs.isNumber,
    object: TypeIs.isObject,
    promise: TypeIs.isPromise,
    regexp: TypeIs.isRegExp,
    result: TypeIs.isResult,
    some: TypeIs.isSome,
    string: TypeIs.isString,
    symbol: TypeIs.isSymbol,
    undefined: TypeIs.isUndefined,
}

export function kindOf<T extends keyof typeof TypeKind>(value: unknown, ...testsKinds: Array<T>): undefined | T {
    return testsKinds.find(kind => TypeKind[kind](value))
}

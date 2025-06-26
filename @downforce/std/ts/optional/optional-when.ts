import type {Io} from '../fn/fn-type.js'
import {isNone, isSome} from './optional-is.js'
import type {None} from './optional-type.js'

export function whenOptional<I, O1, O2>(
    input: I,
    onSome: Io<NonNullable<I>, O1>,
    onNone: Io<Extract<I, None>, O2>,
): O1 | O2 {
    return ! isNone(input)
        ? onSome(input as NonNullable<I>)
        : onNone(input as Extract<I, None>)
}

export function whenSome<I, O>(input: I, onSome: Io<NonNullable<I>, O>): O | Extract<I, None> {
    return isSome(input)
        ? onSome(input as NonNullable<I>)
        : input as Extract<I, None>
}

export function whenNone<I, O>(input: I, onNone: Io<Extract<I, None>, O>): O | Exclude<I, void | None> {
    return isNone(input)
        ? onNone(input as Extract<I, None>)
        : input as Exclude<I, void | None>
}

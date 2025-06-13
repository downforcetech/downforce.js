import type {Io} from '../fn.js'
import {whenNone, whenOptional, whenSome} from './optional-when.js'
import type {None} from './optional-type.js'

export function mapOptionalTo<I, O1, O2>(
    onSome: Io<NoInfer<NonNullable<I>>, O1>,
    onNone: Io<NoInfer<Extract<I, None>>, O2>,
): Io<I, O1 | O2>
export function mapOptionalTo<I, O1, O2>(
    onSome: Io<NonNullable<I>, O1>,
    onNone: Io<Extract<I, None>, O2>,
): Io<I, O1 | O2>
export function mapOptionalTo<I, O1, O2>(
    onSome: Io<NonNullable<I>, O1>,
    onNone: Io<Extract<I, None>, O2>,
): Io<I, O1 | O2> {
    return (input: I) => whenOptional(input, onSome, onNone)
}

export function mapSomeTo<I, O>(onSome: Io<NoInfer<NonNullable<I>>, O>): Io<I, O | Extract<I, None>>
export function mapSomeTo<I, O>(onSome: Io<NonNullable<I>, O>): Io<I, O | Extract<I, None>>
export function mapSomeTo<I, O>(onSome: Io<NonNullable<I>, O>): Io<I, O | Extract<I, None>> {
    return (input: I) => whenSome(input, onSome)
}

export function mapNoneTo<I, O>(onNone: Io<Extract<I, None>, O>): Io<I, O | Exclude<I, void | None>> {
    return (input: I) => whenNone(input, onNone)
}

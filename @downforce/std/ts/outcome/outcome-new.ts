import {PartialApplication} from '../fn/fn-partial.js'
import type {Io} from '../fn/fn-type.js'
import {createMonad} from '../monad/monad-new.js'
import type {None} from '../optional/optional-type.js'
import {OutcomeErrorMonadTag} from './outcome-tag.js'
import type {OutcomeError} from './outcome-type.js'

export function createError<const E>(error: E): OutcomeError<E> {
    return createMonad(OutcomeErrorMonadTag, {error: error})
}

export function catchPromiseError<I, const O = unknown>(
    input: PartialApplication.Placeholder,
    errorOptional?: undefined | null | O,
): Io<Promise<I>, Promise<I | OutcomeError<O>>>
export function catchPromiseError<I, const O = unknown>(
    input: Promise<I>,
    errorOptional?: undefined | null | O,
): Promise<I | OutcomeError<O>>
export function catchPromiseError<I, const O = unknown>(
    input: Promise<I> | PartialApplication.Placeholder,
    errorOptional?: undefined | None | O,
): Promise<I | OutcomeError<O>> | Io<Promise<I>, Promise<I | OutcomeError<O>>> {
    if (input === PartialApplication.Placeholder) {
        return (input: Promise<I>) => catchPromiseError(input, errorOptional as O)
    }

    return input.catch(error => createError(errorOptional ?? error))
}

export function _catchPromiseError<I, const O = unknown>(
    errorOptional?: undefined | null | O,
): Io<Promise<I>, Promise<I | OutcomeError<O>>> {
    return (input: Promise<I>) => catchPromiseError(input, errorOptional as O)
}

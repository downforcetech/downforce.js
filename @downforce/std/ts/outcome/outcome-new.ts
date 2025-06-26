import {identity} from '../fn/fn-return.js'
import {createMonad} from '../monad/monad-new.js'
import {OutcomeErrorMonadTag} from './outcome-tag.js'
import type {OutcomeError, OutcomeResultOrError} from './outcome-type.js'

export function ResultOrError<V>(promise: Promise<V>): Promise<OutcomeResultOrError<V, unknown>> {
    return promise.then(identity, Error)
}

export function Error<const E>(error: E): OutcomeError<E> {
    return createMonad(OutcomeErrorMonadTag, {error: error})
}

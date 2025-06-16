import {identity} from '../fn.js'
import {createMonad} from '../monad.js'
import {OutcomeErrorMonadTag, type OutcomeError, type OutcomeResultOrError} from './outcome-type.js'

export function ResultOrError<V>(promise: Promise<V>): Promise<OutcomeResultOrError<V, unknown>> {
    return promise.then(identity, Error)
}

export function Error<const E>(error: E): OutcomeError<E> {
    return createMonad(OutcomeErrorMonadTag, {error: error})
}

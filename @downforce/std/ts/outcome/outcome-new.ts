import {identity} from '../fn.js'
import {OutcomeError, type OutcomeResultOrError} from './outcome-type.js'

export function ResultOrError<V>(promise: Promise<V>): Promise<OutcomeResultOrError<V, unknown>> {
    return promise.then(identity, Error)
}

export function Error<const E>(error: E): OutcomeError<E> {
    return new OutcomeError(error)
}

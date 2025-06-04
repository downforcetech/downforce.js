import type {Io} from '../fn.js'
import {isError} from './outcome-is.js'
import type {OutcomeResultOrError} from './outcome-type.js'

export function mapResultOrError<R, E, O1, O2>(resultOrError: OutcomeResultOrError<R, E>, onResult: Io<R, O1>, onError: Io<E, O2>): O1 | O2 {
    if (isError(resultOrError)) {
        return onError(resultOrError.error)
    }
    return onResult(resultOrError)
}

export function mapResult<R, E, O>(resultOrError: OutcomeResultOrError<R, E>, onResult: Io<R, O>): OutcomeResultOrError<O, E> {
    if (isError(resultOrError)) {
        return resultOrError
    }
    return onResult(resultOrError)
}

export function mapError<R, E, O>(resultOrError: OutcomeResultOrError<R, E>, onError: Io<E, O>): R | O {
    if (isError(resultOrError)) {
        return onError(resultOrError.error)
    }
    return resultOrError
}

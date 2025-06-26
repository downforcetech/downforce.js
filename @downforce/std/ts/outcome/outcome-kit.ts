import type {Io} from '../fn/fn-type.js'
import {isError, isResult} from './outcome-is.js'
import {filterError, filterResult, splitResultOrError} from './outcome-mix.js'
import {Error, ResultOrError} from './outcome-new.js'
import type {OutcomeError, OutcomeErrorOf, OutcomeResultOf, OutcomeResultOrError} from './outcome-type.js'
import {whenError, whenResult, whenResultOrError} from './outcome-when.js'

export const Outcome = {
    from<V>(promise: Promise<V>): Promise<OutcomeResultOrError<V, unknown>> {
        return ResultOrError(promise)
    },

    isResult<R>(resultOrError: R): resultOrError is OutcomeResultOf<R> {
        return isResult(resultOrError)
    },

    isError(resultOrError: unknown): resultOrError is OutcomeError<unknown> {
        return isError(resultOrError)
    },

    filterResult<R>(resultOrError: R): undefined | OutcomeResultOf<R> {
        return filterResult(resultOrError)
    },

    filterError<R>(resultOrError: R): undefined | OutcomeErrorOf<R>['error'] {
        return filterError(resultOrError)
    },

    split<R>(resultOrError: R): [undefined | OutcomeResultOf<R>, undefined | OutcomeErrorOf<R>['error']] {
        return splitResultOrError(resultOrError)
    },

    when<R, E, O1, O2>(resultOrError: OutcomeResultOrError<R, E>, onResult: Io<R, O1>, onError: Io<E, O2>): O1 | O2 {
        return whenResultOrError(resultOrError, onResult, onError)
    },

    whenResult<R, E, O>(resultOrError: OutcomeResultOrError<R, E>, onResult: Io<R, O>): OutcomeResultOrError<O, E> {
        return whenResult(resultOrError, onResult)
    },

    whenError<R, E, O>(resultOrError: OutcomeResultOrError<R, E>, onError: Io<E, O>): R | O {
        return whenError(resultOrError, onError)
    },

    Error<const E>(error: E): OutcomeError<E> {
        return Error(error)
    },
}

import type {Io} from '../fn/fn-type.js'
import {isError, isResult} from './outcome-is.js'
import {matchError, matchOutcome, matchResult} from './outcome-match.js'
import {filterError, filterResult, splitOutcome} from './outcome-mix.js'
import {catchPromise, createError} from './outcome-new.js'
import type {OutcomeError, OutcomeErrorOf, OutcomeResultOf, OutcomeResultOrError} from './outcome-type.js'

export const Outcome = {
    from<V>(promise: Promise<V>): Promise<OutcomeResultOrError<V, unknown>> {
        return catchPromise(promise)
    },
    isResult<R>(value: R): value is OutcomeResultOf<R> {
        return isResult(value)
    },
    isError(value: unknown): value is OutcomeError<unknown> {
        return isError(value)
    },
    split<R>(input: R): [undefined | OutcomeResultOf<R>, undefined | OutcomeErrorOf<R>['error']] {
        return splitOutcome(input)
    },
    filterResult<R>(input: R): undefined | OutcomeResultOf<R> {
        return filterResult(input)
    },
    filterError<R>(input: R): undefined | OutcomeErrorOf<R>['error'] {
        return filterError(input)
    },
    match<I, O1, O2>(input: I, onResult: Io<OutcomeResultOf<I>, O1>, onError: Io<OutcomeErrorOf<I>['error'], O2>): O1 | O2 {
        return matchOutcome(input, onResult, onError)
    },
    matchResult<I, O>(input: I, onResult: Io<OutcomeResultOf<I>, O>): OutcomeResultOrError<O, OutcomeErrorOf<I>['error']> {
        return matchResult(input, onResult)
    },
    matchError<I, O>(input: I, onError: Io<OutcomeErrorOf<I>['error'], O>): O | OutcomeResultOf<I> {
        return matchError(input, onError)
    },
    Error<const E>(error: E): OutcomeError<E> {
        return createError(error)
    },
}

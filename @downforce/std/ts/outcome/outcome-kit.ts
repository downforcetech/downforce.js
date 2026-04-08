import type {Io} from '../fn/fn-type.js'
import {isError, isResult} from './outcome-is.js'
import {matchError, matchOutcome, matchResult} from './outcome-match.js'
import {filterError, filterResult, splitOutcome} from './outcome-mix.js'
import {catchPromiseError, createError} from './outcome-new.js'
import type {OutcomeError, OutcomeErrorOf, OutcomeResultOf, OutcomeResultOrError} from './outcome-type.js'

export const Outcome: {
    from<V>(promise: Promise<V>): Promise<OutcomeResultOrError<V, unknown>>
    isResult<V>(value: V): value is OutcomeResultOf<V>
    isError(value: unknown): value is OutcomeError<unknown>
    split<R, E>(input: OutcomeResultOrError<R, E>): [undefined | R, undefined | E]
    filterResult<R, E>(input: OutcomeResultOrError<R, E>): undefined | R
    filterError<R, E>(input: OutcomeResultOrError<R, E>): undefined | E
    match<I, O1, O2>(input: I, onResult: Io<OutcomeResultOf<I>, O1>, onError: Io<OutcomeErrorOf<I>['error'], O2>): O1 | O2
    matchResult<I, O>(input: I, onResult: Io<OutcomeResultOf<I>, O>): OutcomeResultOrError<O, OutcomeErrorOf<I>['error']>
    matchError<I, O>(input: I, onError: Io<OutcomeErrorOf<I>['error'], O>): O | OutcomeResultOf<I>
    Error<const E>(error: E): OutcomeError<E>
} = {
    from<V>(promise: Promise<V>): Promise<OutcomeResultOrError<V, unknown>> {
        return catchPromiseError(promise)
    },
    isResult<V>(value: V): value is OutcomeResultOf<V> {
        return isResult(value)
    },
    isError(value: unknown): value is OutcomeError<unknown> {
        return isError(value)
    },
    split<R, E>(input: OutcomeResultOrError<R, E>): [undefined | R, undefined | E] {
        return splitOutcome(input)
    },
    filterResult<R, E>(input: OutcomeResultOrError<R, E>): undefined | R {
        return filterResult(input)
    },
    filterError<R, E>(input: OutcomeResultOrError<R, E>): undefined | E {
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

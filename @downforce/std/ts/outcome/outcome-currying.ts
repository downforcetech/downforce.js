import type {Io} from '../fn/fn-type.js'
import type {OutcomeErrorOf, OutcomeResultOf} from './outcome-type.js'
import {whenError, whenResult, whenResultOrError} from './outcome-when.js'

export function matchingResultOrError<I, O1, O2>(onResult: Io<OutcomeResultOf<I>, O1>, onError: Io<OutcomeErrorOf<I>['error'], O2>): Io<I, O1 | O2> {
    return (input: I) => whenResultOrError<any, unknown, O1, O2>(input, onResult, onError)
}

export function matchingResult<I, O>(onResult: Io<OutcomeResultOf<I>, O>): Io<I, O | OutcomeErrorOf<I>> {
    return (input: I) => whenResult<any, unknown, O>(input, onResult) as O | OutcomeErrorOf<I>
}

export function matchingError<I, O>(onError: Io<OutcomeErrorOf<I>['error'], O>): Io<I, O | OutcomeResultOf<I>> {
    return (input: I) => whenError(input, onError) as O | OutcomeResultOf<I>
}

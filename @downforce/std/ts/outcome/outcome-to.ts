import type {Io} from '../fn.js'
import {isError} from './outcome-is.js'
import type {OutcomeErrorOf, OutcomeResultOf, OutcomeResultOrError} from './outcome-type.js'

export function mapResultOrErrorTo<I, O1, O2>(onResult: Io<OutcomeResultOf<I>, O1>, onError: Io<OutcomeErrorOf<I>['error'], O2>): Io<I, O1 | O2> {
    return (input: I) => mapResultOrError(input as OutcomeResultOrError<any, any>, onResult, onError)
}

export function mapResultTo<I, O>(onResult: Io<OutcomeResultOf<I>, O>): Io<I, O | OutcomeErrorOf<I>> {
    return (input: I) => mapResult(input, onResult)
}

export function mapErrorTo<I, O>(onError: Io<OutcomeErrorOf<I>['error'], O>): Io<I, O | OutcomeResultOf<I>> {
    return (input: I) => mapError(input, onError)
}

function mapResultOrError<I, O1, O2>(input: I, onResult: Io<OutcomeResultOf<I>, O1>, onError: Io<OutcomeErrorOf<I>['error'], O2>): O1 | O2 {
    if (isError(input)) {
        return onError(input.error as OutcomeErrorOf<I>['error'])
    }
    return onResult(input as OutcomeResultOf<I>)
}

function mapResult<I, O>(input: I, onResult: Io<OutcomeResultOf<I>, O>): O | OutcomeErrorOf<I> {
    if (isError(input)) {
        return input as OutcomeErrorOf<I>
    }
    return onResult(input as OutcomeResultOf<I>)
}

function mapError<I, O>(input: I, onError: Io<OutcomeErrorOf<I>['error'], O>): O | OutcomeResultOf<I> {
    if (isError(input)) {
        return onError(input.error as OutcomeErrorOf<I>['error'])
    }
    return input as OutcomeResultOf<I>
}

import {PartialApplication} from '../fn/fn-partial.js'
import type {Io} from '../fn/fn-type.js'
import type {IfAnyOrUnknown} from '../type/type-type.js'
import {isError} from './outcome-is.js'
import type {OutcomeErrorOf, OutcomeResultOf} from './outcome-type.js'

export function matchOutcome<I, O1, O2>(
    input: PartialApplication.Placeholder,
    onResult: Io<NoInfer<OutcomeResultOf<I>>, O1>,
    onError: Io<NoInfer<OutcomeErrorOf<I>['error']>, O2>,
): Io<I, O1 | O2>
export function matchOutcome<I, O1, O2>(
    input: I,
    onResult: Io<OutcomeResultOf<I>, O1>,
    onError: Io<OutcomeErrorOf<I>['error'], O2>,
): O1 | O2
export function matchOutcome<I, O1, O2>(
    input: I | PartialApplication.Placeholder,
    onResult: Io<OutcomeResultOf<I>, O1>,
    onError: Io<OutcomeErrorOf<I>['error'], O2>,
): O1 | O2 | Io<I, O1 | O2> {
    if (input === PartialApplication.Placeholder) {
        return (input: I) => matchOutcome(input, onResult, onError)
    }

    return ! isError(input)
        ? onResult(input as OutcomeResultOf<I>)
        : onError(input.error)
}

export const matchResultOrError: typeof matchOutcome = matchOutcome

export function matchResult<I, O1, O2 = OutcomeErrorOf<I>>(
    input: PartialApplication.Placeholder,
    onMatch: Io<NoInfer<OutcomeResultOf<I>>, O1>,
    onElse?: undefined | Io<NoInfer<OutcomeErrorOf<I>>, O2>
): Io<I, O1 | O2>
export function matchResult<I, O1, O2 = OutcomeErrorOf<I>>(
    input: I,
    onMatch: Io<NoInfer<OutcomeResultOf<I>>, O1>,
    onElse?: undefined | Io<NoInfer<OutcomeErrorOf<I>>, O2>
): O1 | O2
export function matchResult<I, O1, O2 = OutcomeErrorOf<I>>(
    input: I | PartialApplication.Placeholder,
    onMatch: Io<NoInfer<OutcomeResultOf<I>>, O1>,
    onElse?: undefined | Io<NoInfer<OutcomeErrorOf<I>>, O2>
): O1 | O2 | Io<I, O1 | O2> {
    if (input === PartialApplication.Placeholder) {
        return (input: I) => matchResult(input, onMatch)
    }

    if (! isError(input)) {
        return onMatch(input as OutcomeResultOf<I>)
    }
    if (onElse) {
        return onElse(input as OutcomeErrorOf<I>)
    }
    return input as unknown as O2
}

export function matchError<I, O1, O2 = OutcomeResultOf<I>>(
    input: PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, unknown, OutcomeErrorOf<I>['error']>>, O1>,
    onElse?: undefined | Io<NoInfer<OutcomeResultOf<I>>, O2>
): Io<I, O1 | O2>
export function matchError<I, O1, O2 = OutcomeResultOf<I>>(
    input: I,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, unknown, OutcomeErrorOf<I>['error']>>, O1>,
    onElse?: undefined | Io<NoInfer<OutcomeResultOf<I>>, O2>
): O1 | O2
export function matchError<I, O1, O2 = OutcomeResultOf<I>>(
    input: I | PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, unknown, OutcomeErrorOf<I>['error']>>, O1>,
    onElse?: undefined | Io<NoInfer<OutcomeResultOf<I>>, O2>
): O1 | O2 | Io<I, O1 | O2> {
    if (input === PartialApplication.Placeholder) {
        return (input: I) => matchError(input, onMatch)
    }

    if (isError(input)) {
        return onMatch(input.error)
    }
    if (onElse) {
        return onElse(input as OutcomeResultOf<I>)
    }
    return input as unknown as O2
}

export function _matchOutcome<I, O1, O2>(
    onResult: Io<NoInfer<OutcomeResultOf<I>>, O1>,
    onError: Io<NoInfer<OutcomeErrorOf<I>>['error'], O2>,
): Io<I, O1 | O2> {
    return (input: I) => matchOutcome(input, onResult, onError) as unknown as O1 | O2
}

export const _matchResultOrError: typeof _matchOutcome = _matchOutcome

export function _matchResult<I, O1, O2 = OutcomeErrorOf<I>>(
    onMatch: Io<NoInfer<OutcomeResultOf<I>>, O1>,
    onElse?: undefined | Io<NoInfer<OutcomeErrorOf<I>>, O2>
): Io<I, O1 | O2> {
    return (input: I) => matchResult(input, onMatch, onElse)
}

export function _matchError<I, O1, O2 = OutcomeResultOf<I>>(
    onMatch: Io<NoInfer<OutcomeErrorOf<I>['error']>, O1>,
    onElse?: undefined | Io<NoInfer<OutcomeResultOf<I>>, O2>
): Io<I, O1 | O2> {
    return (input: I) => matchError(input, onMatch, onElse)
}

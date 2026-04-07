import {isError} from './outcome-is.js'
import type {OutcomeErrorOf, OutcomeResultOf} from './outcome-type.js'

export function splitOutcome<R>(resultOrError: R): [undefined | OutcomeResultOf<R>, undefined | OutcomeErrorOf<R>['error']] {
    return [filterResult(resultOrError), filterError(resultOrError)]
}

export const splitResultOrError: typeof splitOutcome = splitOutcome

export function filterResult<R>(resultOrError: R): undefined | OutcomeResultOf<R> {
    if (isError(resultOrError)) {
        return
    }
    return resultOrError as OutcomeResultOf<R>
}

export function filterError<R>(resultOrError: R): undefined | OutcomeErrorOf<R>['error'] {
    if (isError(resultOrError)) {
        return resultOrError.error
    }
    return
}

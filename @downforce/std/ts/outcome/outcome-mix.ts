import {isError} from './outcome-is.js'
import type {OutcomeResultOf, OutcomeResultOrError} from './outcome-type.js'

export function splitOutcome<R, E>(input: OutcomeResultOrError<R, E>): [undefined | R, undefined | E] {
    return [filterResult(input), filterError(input)]
}

export const splitResultOrError: typeof splitOutcome = splitOutcome

export function filterResult<R, E>(input: OutcomeResultOrError<R, E>): undefined | R {
    if (isError(input)) {
        return
    }
    return input as OutcomeResultOf<R>
}

export function filterError<R, E>(input: OutcomeResultOrError<R, E>): undefined | E {
    if (isError(input)) {
        return input.error
    }
    return
}

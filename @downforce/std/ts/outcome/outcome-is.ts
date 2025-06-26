import {isMonadType} from '../monad/monad-is.js'
import {OutcomeErrorMonadTag} from './outcome-tag.js'
import type {OutcomeError, OutcomeResultOf} from './outcome-type.js'

export function isResult<R>(resultOrError: R): resultOrError is OutcomeResultOf<R> {
    return ! isError(resultOrError)
}

export function isError(resultOrError: unknown): resultOrError is OutcomeError<unknown> {
    return isMonadType<OutcomeError<unknown>>(resultOrError, OutcomeErrorMonadTag)
}

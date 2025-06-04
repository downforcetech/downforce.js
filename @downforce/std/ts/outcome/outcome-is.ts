import {isObject} from '../object.js'
import {OutcomeError, type OutcomeResultOf} from './outcome-type.js'

export function isResult<R>(resultOrError: R): resultOrError is OutcomeResultOf<R> {
    return ! isError(resultOrError)
}

export function isError(resultOrError: unknown): resultOrError is OutcomeError<unknown> {
    return isObject(resultOrError) && resultOrError instanceof OutcomeError
    // return isMonadType(resultOrError, OutcomeErrorMonadTag)
}

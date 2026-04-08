import {isMonadType} from '../monad/monad-is.js'
import {OutcomeErrorMonadTag} from './outcome-tag.js'
import type {OutcomeError, OutcomeResultOf} from './outcome-type.js'

export function isResult<V>(value: V): value is OutcomeResultOf<V> {
    return ! isError(value)
}

export function isError(value: unknown): value is OutcomeError<unknown> {
    return isMonadType<OutcomeError<unknown>>(value, OutcomeErrorMonadTag)
}

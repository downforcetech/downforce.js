import {identity} from '../fn/fn-return.js'
import {createMonad} from '../monad/monad-new.js'
import {OutcomeErrorMonadTag} from './outcome-tag.js'
import type {OutcomeError, OutcomeResultOrError} from './outcome-type.js'

export function createError<const E>(error: E): OutcomeError<E> {
    return createMonad(OutcomeErrorMonadTag, {error: error})
}

export function catchPromise<V>(promise: Promise<V>): Promise<OutcomeResultOrError<V, unknown>> {
    return promise.then(identity, createError)
}

import {identity} from './fn-return.js'
import {MonadTag, type Monad} from './monad.js'
import {throwInvalidType} from './throw.js'
import {InvalidTypeMessage} from './type-ensure.js'
import {isObject} from './type-is.js'

export const ResultErrorTagId = 'error'

export class Result {
    static from<V>(promise: Promise<V>): Promise<ResultOrError<V, unknown>> {
        return asResultOrError(promise)
    }

    static isResult<R>(resultOrError: R): resultOrError is ResultOf<R> {
        return isResult(resultOrError)
    }

    static isError(resultOrError: unknown): resultOrError is ResultError<unknown> {
        return isError(resultOrError)
    }

    static resultOf<R>(resultOrError: R): undefined | ResultOf<R> {
        return resultOf(resultOrError)
    }

    static errorOf<R>(resultOrError: R): undefined | ResultErrorOf<R>['error'] {
        return errorOf(resultOrError)
    }

    static split<R>(resultOrError: R): [undefined | ResultOf<R>, undefined | ResultErrorOf<R>['error']] {
        return splitResultOrError(resultOrError)
    }

    static map<R, E, O1, O2>(
        resultOrError: ResultOrError<R, E>,
        matches: {
            result(result: R): O1
            error(error: E): O2
        },
    ): O1 | O2 {
        return mapResultOrError(resultOrError, matches)
    }

    static mapResult<R, E, O1>(
        resultOrError: ResultOrError<R, E>,
        onResult: (result: R) => O1,
    ): ResultOrError<O1, E> {
        return mapResult(resultOrError, onResult)
    }

    static mapError<R, E, O1>(
        resultOrError: ResultOrError<R, E>,
        onError: (error: E) => O1,
    ): R | O1 {
        return mapError(resultOrError, onError)
    }

    static Error<const E>(error: E): ResultError<E> {
        return ResultError(error)
    }
}

export function ResultError<const E>(error: E): ResultError<E> {
    return {
        [MonadTag]: ResultErrorTagId,
        error,
    }
}

export function asResultOrError<V>(promise: Promise<V>): Promise<ResultOrError<V, unknown>> {
    return promise.then(identity, ResultError)
}

export function isResult<R>(resultOrError: R): resultOrError is ResultOf<R> {
    return ! isError(resultOrError)
}

export function isError(resultOrError: unknown): resultOrError is ResultError<unknown> {
    return (
        isObject(resultOrError)
        && (MonadTag in resultOrError)
        && resultOrError[MonadTag] === ResultErrorTagId
    )
}

export function resultOf<R>(resultOrError: R): undefined | ResultOf<R> {
    return ! isError(resultOrError)
        ? resultOrError as ResultOf<R>
        : undefined
}

export function errorOf<R>(resultOrError: R): undefined | ResultErrorOf<R>['error'] {
    return isError(resultOrError)
        ? resultOrError.error
        : undefined
}

export function splitResultOrError<R>(resultOrError: R): [undefined | ResultOf<R>, undefined | ResultErrorOf<R>['error']] {
    return [resultOf(resultOrError), errorOf(resultOrError)]
}

export function mapResult<R, E, O1>(
    resultOrError: ResultOrError<R, E>,
    onResult: (result: R) => O1,
): ResultOrError<O1, E> {
    if (isError(resultOrError)) {
        return resultOrError
    }
    return onResult(resultOrError)
}

export function mapError<R, E, O1>(
    resultOrError: ResultOrError<R, E>,
    onError: (error: E) => O1,
): R | O1 {
    if (isError(resultOrError)) {
        return onError(resultOrError.error)
    }
    return resultOrError
}

export function mapResultOrError<R, E, O1, O2>(
    resultOrError: ResultOrError<R, E>,
    matches: {
        result(result: R): O1
        error(error: E): O2
    },
): O1 | O2 {
    if (isError(resultOrError)) {
        return matches.error(resultOrError.error)
    }
    return matches.result(resultOrError)
}

/**
* @throws InvalidInput
*/
export function ensureResult<V, E>(value: ResultOrError<V, E>, ctx?: any): V {
    if (! isResult(value)) {
        return throwInvalidType(InvalidTypeMessage('a Result', value, ctx))
    }
    return value
}

/**
* @throws InvalidInput
*/
export function assertResult<V, E>(value: ResultOrError<V, E>, ctx?: any): asserts value is V {
    ensureResult(value, ctx)
}

// Types ///////////////////////////////////////////////////////////////////////

export interface ResultError<E> extends Monad<typeof ResultErrorTagId> {
    error: E
}

export type ResultOrError<V, E> = V | ResultError<E>
export type ResultOf<V> = Exclude<V, ResultError<unknown>>
export type ResultErrorOf<V> = Extract<V, ResultError<unknown>>

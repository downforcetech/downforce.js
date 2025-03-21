import type {Fn} from './fn-type.js'

export function clonePromise<P>(value: P): Promise<Awaited<P>> {
    return Promise.resolve(value)
}

export function splitPromise<R, E = unknown>(promise: Promise<R>): Promise<[R, undefined] | [undefined, E]> {
    return promise.then(
        result => [result, undefined],
        error => [undefined, error],
    )
}

/**
* A facade api for the new and not yed widely supported Promise.withResolvers().
*/
export function createPromise<V = void>(): ReturnType<typeof Promise.withResolvers<V>> {
    let resolve: Fn<[value: V | PromiseLike<V>]>
    let reject: Fn<[reason?: any]>

    const promise = new Promise<V>((localResolve, localReject) => {
        resolve = localResolve
        reject = localReject
    })

    return {promise, resolve: resolve!, reject: reject!}
}

export function isPromiseSettledFulfilled<T>(promise: PromiseSettledResult<T>): promise is PromiseFulfilledResult<T> {
    return promise.status === 'fulfilled'
}

export function isPromiseSettledRejected<T>(promise: PromiseSettledResult<T>): promise is PromiseRejectedResult {
    return promise.status === 'rejected'
}

// Types ///////////////////////////////////////////////////////////////////////

export interface PromiseView {
    readonly pending: boolean // Not settled.
    readonly settled: boolean // Not pending.
    readonly fulfilled: boolean // Success.
    readonly rejected: boolean // Fail.
}

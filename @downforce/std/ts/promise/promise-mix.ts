import {noop} from '../fn.js'

/**
* A facade api for the new and not yed widely supported Promise.withResolvers().
*/
export function createPromise<V = void>(): ReturnType<typeof Promise.withResolvers<V>> {
    let resolve: (value: V | PromiseLike<V>) => void = noop
    let reject: (reason?: any) => void = noop

    const promise = new Promise<V>((localResolve, localReject) => {
        resolve = localResolve
        reject = localReject
    })

    return {promise, resolve: resolve, reject: reject}
}

export function splitPromise<R, E = unknown>(promise: Promise<R>): Promise<[R, undefined] | [undefined, E]> {
    return promise.then(
        result => [result, undefined],
        error => [undefined, error],
    )
}

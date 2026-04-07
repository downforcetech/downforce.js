import {noop} from '../fn/fn-return.js'

/**
* A facade api for the new and not yed widely supported Promise.withResolvers().
*/
export function createPromise<V = undefined>(): {
    promise: Promise<V>
    resolve(value: V | PromiseLike<V>): undefined
    reject(reason?: any): undefined
} {
    let resolve: ((value: V | PromiseLike<V>) => undefined) = noop
    let reject: ((reason?: any) => undefined) = noop

    const promise = new Promise<V>((localResolve, localReject) => {
        resolve = localResolve as typeof resolve
        reject = localReject as typeof reject
    })

    return {promise, resolve: resolve, reject: reject}
}

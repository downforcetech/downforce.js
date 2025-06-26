import {noop} from '../fn/fn-return.js'

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

import {createPromise} from '../promise/promise-new.js'

export function createPromiseTimed<V = undefined>(args: PromiseTimedOptions): {
    promise: Promise<V>
    resolve: (value: V) => undefined
    reject: (reason?: any) => undefined
} {
    const {timeout} = args

    const {promise, resolve, reject} = createPromise<V>()

    const timeoutId = timeout
        ? setTimeout(onTimeout, timeout)
        : undefined

    function onTimeout(): undefined {
        reject()
    }

    function onResolve(value: V): undefined {
        clearTimeout(timeoutId)
        resolve(value)
    }

    function onReject(reason?: any): undefined {
        clearTimeout(timeoutId)
        reject(reason)
    }

    return {promise, resolve: onResolve, reject: onReject}
}

// Types ///////////////////////////////////////////////////////////////////////

export interface PromiseTimedOptions {
    timeout?: undefined | number
}

export function isPromise(value: unknown): value is Promise<unknown> {
    if (! value) {
        return false
    }
    return value instanceof Promise
}

export function isPromiseSettledFulfilled<V>(promise: PromiseSettledResult<V>): promise is PromiseFulfilledResult<V> {
    return promise.status === 'fulfilled'
}

export function isPromiseSettledRejected<V>(promise: PromiseSettledResult<V>): promise is PromiseRejectedResult {
    return promise.status === 'rejected'
}

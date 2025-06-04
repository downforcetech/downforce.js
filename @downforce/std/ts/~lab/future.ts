import type {CancelableProtocol, CancelableState} from '../cancel.js'
import {call, type Task} from '../fn.js'
import type {PromiseView} from '../promise.js'
import type {Writable} from '../type.js'

export class Future<R, E = unknown> {
    static from<P, E = unknown>(promise: P): Future<Awaited<P>, E> {
        return futureWrap(promise)
    }

    static new<V, E = unknown>(
        executor: (
            resolve: (value: V | PromiseLike<V>) => void,
            reject: (error?: E) => void,
        ) => void,
    ): Future<Awaited<V>, E> {
        return createFuture(executor)
    }
}

export function createFuture<R, E = unknown>(
    executor: (
        resolve: (value: R | PromiseLike<R>) => void,
        reject: (error?: E) => void,
    ) => void,
): Future<Awaited<R>, E> {
    return futureWrap(new Promise<R>(executor))
}

export function futureWrap<P, E = unknown>(value: P | PromiseLike<P>): Future<Awaited<P>, E> {
    const state: Writable<FutureState<Awaited<P>, E>> & ObserversCleanup = {
        pending: true,
        settled: false,
        fulfilled: false,
        rejected: false,
        canceled: false,
        result: undefined,
        error: undefined,
        onCancelObservers: [],
    }

    interface ObserversCleanup {
        onCancelObservers: Array<Task>
    }

    const promise = Promise.resolve(value).then(
        result => {
            state.pending = false
            state.settled = true
            state.fulfilled = true
            state.rejected = false
            state.result = result
            return result
        },
        error => {
            state.pending = false
            state.settled = true
            state.fulfilled = false
            state.rejected = true
            state.error = error
            throw error
        },
    )

    const self: Future<Awaited<P>, E> = {
        // Promise Protocol ////////////////////////////////////////////////////

        then(onFulfil, onReject) {
            return promise.then(onFulfil, onReject)
        },

        catch(onReject) {
            return promise.catch(onReject)
        },

        finally(onFinally) {
            return promise.finally(onFinally)
        },

        get [Symbol.toStringTag]() {
            return promise[Symbol.toStringTag]
        },

        // Future Protocol /////////////////////////////////////////////////////

        get pending() {
            return state.pending
        },

        get settled() {
            return state.settled
        },

        get fulfilled() {
            return state.fulfilled
        },

        get rejected() {
            return state.rejected
        },

        get result() {
            return state.result
        },

        get error() {
            return state.error
        },

        // Cancelable Protocol /////////////////////////////////////////////////

        get canceled() {
            return state.canceled
        },

        cancel() {
            state.canceled = true

            state.onCancelObservers.forEach(call)
        },

        onCancel(onCancel) {
            state.onCancelObservers.push(onCancel)

            function offCancel() {
                state.onCancelObservers = state.onCancelObservers.filter(it => it !== onCancel)
            }

            return offCancel
        },
    }

    return self
}

// Type ////////////////////////////////////////////////////////////////////////

export interface Future<R, E = unknown> extends Promise<R>, FutureState<R, E>, CancelableProtocol {
    onCancel(onCancel: Task): Task
}

export interface FutureState<R, E = unknown> extends PromiseView, CancelableState {
    readonly result: undefined | R
    readonly error: undefined | E
}

import {getMapValue} from '@downforce/std/map'
import {Ref, type ValueRef} from '@downforce/std/store'

export const SuspensePromiseMap: WeakMap<SuspensePromiseMapKey, SuspenseStateRef> = new WeakMap()

type SuspensePromiseMapKey<V = any> = Promise<V>
type SuspenseStateRef<V = any> = ValueRef<SuspenseState<V>>

/**
* @throws Promise | Error
*/
export function useSuspense<R>(promise: Promise<R>): R {
    const weakMap = SuspensePromiseMap as WeakMap<SuspensePromiseMapKey<R>, SuspenseStateRef<R>>
    const suspenseRef = getMapValue(weakMap, promise, () => createSuspenseRef(promise))
    const suspense = suspenseRef.value

    switch (suspense.stage) {
        case 'pending': throw suspense.promise
        case 'fulfilled': return suspense.result
        case 'rejected': throw suspense.error
    }
}

export function createSuspenseRef<R>(promise: Promise<R>): ValueRef<SuspenseState<R>> {
    const promiseHandled = promise.then(
        result => {
            suspense.value = {
                stage: 'fulfilled',
                result: result,
                error: undefined,
                promise: promiseHandled,
            }
        },
        error => {
            suspense.value = {
                stage: 'rejected',
                result: undefined,
                error: error,
                promise: promiseHandled,
            }
        },
    )

    const suspense = Ref<SuspenseState<R>>({
        stage: 'pending',
        result: undefined,
        error: undefined,
        promise: promiseHandled,
    })

    return suspense
}

// Types ///////////////////////////////////////////////////////////////////////

type SuspenseState<R> =
    | {
        stage: 'pending'
        result: undefined
        error: undefined
        promise: Promise<void>
    }
    | {
        stage: 'fulfilled'
        result: R
        error: undefined
        promise: Promise<void>
    }
    | {
        stage: 'rejected'
        result: undefined
        error: unknown
        promise: Promise<void>
    }

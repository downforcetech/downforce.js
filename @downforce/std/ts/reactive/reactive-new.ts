import {areEqualIdentity} from '../struct/struct-equal.js'
import type {ReactiveObserver, ReactiveOptions, ReactiveObject} from './reactive-type.js'

export const ReactiveStateSymbol: unique symbol = Symbol('ReactiveState')

export function createReactive<V>(
    value: V,
    options?: undefined | ReactiveOptions<NoInfer<V>>,
): ReactiveObject<V> {
    return {
        [ReactiveStateSymbol]: {
            value: value,
            comparator: options?.equals ?? areEqualIdentity,
            middleware: options?.middleware,
            observers: new Set<ReactiveObserver<V>>(),
            notification: undefined,
        },
    }
}

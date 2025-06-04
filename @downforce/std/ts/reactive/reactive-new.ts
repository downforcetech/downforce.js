import {areEqualIdentity} from '../struct.js'
import type {ReactiveObserver, ReactiveOptions, ReactiveProtocol} from './reactive-type.js'

export const ReactiveStateSymbol: unique symbol = Symbol('ReactiveState')

export function createReactive<V>(
    value: V,
    options?: undefined | ReactiveOptions<NoInfer<V>>,
): ReactiveProtocol<V> {
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

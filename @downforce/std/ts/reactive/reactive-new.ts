import {areEqual} from '../value/value-equal.js'
import type {ReactiveObject, ReactiveOptions} from './reactive-type.js'

export const ReactiveStateSymbol: unique symbol = Symbol('ReactiveState')

export function createReactive<V>(
    value: V,
    options?: undefined | ReactiveOptions<NoInfer<V>>,
): ReactiveObject<V> {
    const initialGeneration = 0

    const self: ReactiveObject<V> = {
        [ReactiveStateSymbol]: {
            value: value,
            generation: initialGeneration,
            comparator: options?.equals ?? areEqual,
            middleware: options?.middleware,
            observersMap: new Map(),
            observersSet: new Set(),
            notificationCleanup: undefined,
            notificationGeneration: initialGeneration,
        },
        // @ts-expect-error
        [Symbol.toStringTag]: 'Reactive',
        toString() {
            const value = self[ReactiveStateSymbol]!.value

            try {
                return JSON.stringify(value)
            }
            catch (error) {
                return String(value)
            }
        },
    }

    return self
}

import type {Task} from '../fn.js'

// Types ///////////////////////////////////////////////////////////////////////

export interface ReactiveProtocol<V> {
    [key: symbol]: ReactiveState<V>
}

export interface ReactiveState<V> {
    value: V
    readonly comparator: ReactiveComparator<V>
    readonly middleware: undefined | ReactiveMiddleware<V>
    readonly observers: Set<ReactiveObserver<V>>
    notification: undefined | Task
}

export type ReactiveMiddleware<V> = (newValue: V, oldValue: V) => V
export type ReactiveObserver<V> = (newValue: V, oldValue: V) => void
export type ReactiveComparator<V> = (oldValue: V, newValue: V) => boolean

export interface ReactiveOptions<V> {
    equals?: undefined | ReactiveComparator<V>
    middleware?: undefined | ReactiveMiddleware<V>
}

export interface ReactiveWatchOptions {
    immediate?: undefined | boolean
}

export type ReactiveValueOf<R extends ReactiveProtocol<any>> =
    R extends ReactiveProtocol<infer V>
        ? V
        : never

export type ReactiveValuesOf<A extends Array<ReactiveProtocol<any>>> =
    {[key in keyof A]: ReactiveValueOf<A[key]>}

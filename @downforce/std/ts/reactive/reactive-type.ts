import type {Task} from '../fn/fn-type.js'

// Types ///////////////////////////////////////////////////////////////////////

export interface ReactiveObject<V> {
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
export type ReactiveComparator<V> = (newValue: V, oldValue: V) => boolean

export interface ReactiveOptions<V> {
    equals?: undefined | ReactiveComparator<V>
    middleware?: undefined | ReactiveMiddleware<V>
}

export interface ReactiveWatchOptions {
    immediate?: undefined | boolean
}

export type ReactiveValueOf<R extends ReactiveObject<any>> =
    R extends ReactiveObject<infer V>
        ? V
        : never

export type ReactiveValuesOf<A extends Array<ReactiveObject<any>>> =
    {[key in keyof A]: ReactiveValueOf<A[key]>}

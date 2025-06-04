// Types ///////////////////////////////////////////////////////////////////////

export type FnArgs = Array<unknown>

export type Fn<A extends FnArgs, R = void> = (...args: A) => R
export type FnAsync<A extends FnArgs, R = void> = (...args: A) => Promise<R>

export type Io<I,O> = (input: I) => O
export type IoAsync<I, O> = (input: I) => Promise<O>

export type Handler<V> = (value: V) => void

export type Task<R = void> = () => R
export type TaskAsync<R = void> = () => Promise<R>

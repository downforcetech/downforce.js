// Types ///////////////////////////////////////////////////////////////////////

export type FnArgs = Array<unknown>

export type Fn<A extends FnArgs, R = void> = FnSync<A, R>
export type FnSync<A extends FnArgs, R = void> = (...args: A) => R
export type FnAsync<A extends FnArgs, R = void> = (...args: A) => Promise<R>

export type Io<I,O> = IoSync<I, O>
export type IoSync<I,O> = (input: I) => O
export type IoAsync<I, O> = (input: I) => Promise<O>

export type Task<R = void> = TaskSync<R>
export type TaskSync<R = void> = () => R
export type TaskAsync<R = void> = () => Promise<R>

export type Handler<V> = (value: V) => void

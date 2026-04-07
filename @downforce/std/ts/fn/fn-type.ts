// Types ///////////////////////////////////////////////////////////////////////

export type FnArgs = Array<unknown>

export type Fn<A extends FnArgs, R = undefined> = FnSync<A, R>
export type FnSync<A extends FnArgs, R = undefined> = (...args: A) => R
export type FnAsync<A extends FnArgs, R = undefined> = (...args: A) => Promise<R>

export type Io<I,O> = IoSync<I, O>
export type IoSync<I,O> = (input: I) => O
export type IoAsync<I, O> = (input: I) => Promise<O>

export type Task<R = undefined> = TaskSync<R>
export type TaskSync<R = undefined> = () => R
export type TaskAsync<R = undefined> = () => Promise<R>

export type Handler<V> = (value: V) => undefined

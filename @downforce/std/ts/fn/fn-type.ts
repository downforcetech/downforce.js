import type {Void} from '../type/type-type.js'

// Types ///////////////////////////////////////////////////////////////////////

export type FnArgs = Array<unknown>

export type Fn<A extends FnArgs, R = Void> = FnSync<A, R>
export type FnSync<A extends FnArgs, R = Void> = (...args: A) => R
export type FnAsync<A extends FnArgs, R = Void> = (...args: A) => Promise<R>

export type Io<I,O> = IoSync<I, O>
export type IoSync<I,O> = (input: I) => O
export type IoAsync<I, O> = (input: I) => Promise<O>

export type Task<R = Void> = TaskSync<R>
export type TaskSync<R = Void> = () => R
export type TaskAsync<R = Void> = () => Promise<R>

export type Handler<V> = (value: V) => Void

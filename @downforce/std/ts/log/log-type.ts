// Types ///////////////////////////////////////////////////////////////////////

export type Logger<T, R> = (type: T, ...args: LoggerArgs) => R
export type LoggerAsync<T, R> = (type: T, ...args: LoggerArgs) => Promise<R>
export type LoggerArgs = Array<unknown>

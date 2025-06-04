import type {Logger, LoggerArgs} from './log-type.js'

export function logConditional<T, R>(
    logger: Logger<T, R>,
    test: LogFilter<T>,
    type: T,
    ...args: LoggerArgs
): undefined | R {
    if (! test(type, args)) {
        return
    }
    return logger(type, ...args)
}

// Types ///////////////////////////////////////////////////////////////////////

export type LogFilter<T> = (type: T, args: LoggerArgs) => boolean

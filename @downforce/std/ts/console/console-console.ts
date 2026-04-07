import {arrayWrap} from '../array/array-mix.js'
import {identity} from '../fn/fn-return.js'
import type {Io} from '../fn/fn-type.js'
import type {LoggerArgs} from '../log/log-type.js'
import type {ConsoleLogType} from './console-type.js'

export function consoleLog(type: ConsoleLogType, ...args: LoggerArgs): undefined {
    switch (type) {
        case 'debug': return void console.debug(...args ?? [])
        case 'error': return void console.error(...args ?? [])
        case 'log': return void console.log(...args ?? [])
        case 'info': return void console.info(...args ?? [])
        case 'warn': return void console.warn(...args ?? [])
        default: return void console.log(...args ?? [])
    }
}

export function _consoleLog<I>(
    typeOptional?: undefined | ConsoleLogType,
    formatOptional?: undefined | Io<I, unknown>,
): Io<I, I> {
    const type: ConsoleLogType = typeOptional ?? 'log'
    const format = formatOptional ?? identity

    return (input: I): I => {
        const logArgs = arrayWrap(format(input))

        consoleLog(type, ...logArgs)

        return input
    }
}

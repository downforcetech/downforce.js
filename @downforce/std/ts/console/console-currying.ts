import {arrayWrap} from '../array/array-mix.js'
import {identity} from '../fn/fn-return.js'
import type {Io} from '../fn/fn-type.js'
import {consoleLog} from './console-mix.js'
import type {ConsoleLogType} from './console-type.js'

export function consoleLogging<I>(
    typeOptional?: undefined | ConsoleLogType,
    formatOptional?: undefined | Io<I, unknown>,
): Io<I, I> {
    const type: ConsoleLogType = typeOptional ?? 'log'
    const format = formatOptional ?? identity

    function chainLog(input: I): I {
        const logArgs = arrayWrap(format(input))

        consoleLog(type, ...logArgs)

        return input
    }

    return chainLog
}

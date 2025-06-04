import {arrayWrap} from '../array.js'
import {identity, type Io} from '../fn.js'
import {consoleLog} from './console-mix.js'
import type {ConsoleLogType} from './console-type.js'

export function consoleLogTo<V>(
    typeOptional?: undefined | ConsoleLogType,
    formatOptional?: undefined | Io<V, unknown>,
): Io<V, V> {
    const type: ConsoleLogType = typeOptional ?? 'log'
    const format = formatOptional ?? identity

    function chainLog(input: V): V {
        const logArgs = arrayWrap(format(input))

        consoleLog(type, ...logArgs)

        return input
    }

    return chainLog
}

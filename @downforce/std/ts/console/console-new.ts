import {logConditional, type LogFilter} from '../log/log-mix.js'
import type {Logger, LoggerArgs} from '../log/log-type.js'
import {consoleLog} from './console-mix.js'
import type {ConsoleLogType} from './console-type.js'

export const ConsoleLogTypes: Array<ConsoleLogType> = ['debug', 'error', 'info', 'log', 'warn']
export const ConsoleLogTypesWithoutDebug: Array<ConsoleLogType> = ConsoleLogTypes.filter(it => it !== 'debug')

export function createConsoleLogger<R = void>(options?: undefined | {
    logger?: undefined | Logger<ConsoleLogType, R>,
    types?: undefined | Array<ConsoleLogType>
}): Logger<ConsoleLogType, undefined | R> {
    const logger = options?.logger ?? (consoleLog as Logger<ConsoleLogType, R>)
    const types = options?.types ?? ConsoleLogTypes

    const filter: LogFilter<ConsoleLogType> = (type, args) => types.includes(type)

    function log(type: ConsoleLogType, ...args: LoggerArgs): undefined | R {
        return logConditional(logger, filter, type, ...args)
    }

    return log
}

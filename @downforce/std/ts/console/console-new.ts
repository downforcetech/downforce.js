import {logConditional, type LogFilter, type Logger, type LoggerArgs} from '../log.js'
import {consoleLog} from './console-mix.js'
import {ConsoleLogTypes, type ConsoleLogType} from './console-type.js'

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

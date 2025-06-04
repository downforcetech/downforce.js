import type {Logger, LoggerArgs} from '../log.js'
import type {ConsoleLogType} from './console-type.js'

export class ConsoleLogger<R> {
    static new<R>(logger: Logger<ConsoleLogType, R>): ConsoleLogger<R> {
        return new ConsoleLogger(logger)
    }

    logger: Logger<ConsoleLogType, R>

    constructor(logger: Logger<ConsoleLogType, R>) {
        this.logger = logger
    }

    debug = (...args: LoggerArgs): R => this.logger('debug', ...args)
    error = (...args: LoggerArgs): R => this.logger('error', ...args)
    log = (...args: LoggerArgs): R => this.logger('log', ...args)
    info = (...args: LoggerArgs): R => this.logger('info', ...args)
    warn = (...args: LoggerArgs): R => this.logger('warn', ...args)
}

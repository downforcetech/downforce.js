import type {LoggerArgs} from '../log.js'
import type {ConsoleLogType} from './console-type.js'

export function consoleLog(type: ConsoleLogType, ...args: LoggerArgs): void {
    switch (type) {
        case 'debug': return console.debug(...args ?? [])
        case 'error': return console.error(...args ?? [])
        case 'log': return console.log(...args ?? [])
        case 'info': return console.info(...args ?? [])
        case 'warn': return console.warn(...args ?? [])
        default: return console.log(...args ?? [])
    }
}

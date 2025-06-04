export const ConsoleLogTypes: Array<ConsoleLogType> = [
    'debug',
    'error',
    'info',
    'log',
    'warn',
]
export const ConsoleLogTypesWithoutDebug: Array<ConsoleLogType> = ConsoleLogTypes.filter(it => it !== 'debug')

export type ConsoleLogType =
    | 'debug'
    | 'error'
    | 'info'
    | 'log'
    | 'warn'

import {isSome} from './optional/optional-is.js'
import {isString} from './string/string-is.js'

/**
* @throws
*/
export function createEnsureOptional<T>(assurance: Assurance<T>): (value: unknown, ...args: Array<unknown>) => undefined | T {
    function ensure(value: unknown, ...args: Array<unknown>): undefined | T {
        if (! isSome(value)) {
            return
        }
        return assurance(value, ...args)
    }

    return ensure
}

export function formatEnsureInvalidTypeMessage(expected: string, actual: unknown, ctx?: any): string {
    if (isString(ctx)) {
        return `${ctx} must be ${expected}, given "${actual}".`
    }
    if (isSome(ctx)) {
        return `value must be ${expected}, given "${actual}":\n${JSON.stringify(ctx)}`
    }
    return `value must be ${expected}, given "${actual}".`
}

// Types ///////////////////////////////////////////////////////////////////////

export type Assurance<T> = (value: unknown, ...args: Array<unknown>) => T

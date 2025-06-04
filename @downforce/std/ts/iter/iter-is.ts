import {isFunction} from '../fn.js'

export function isIterator(value: unknown): value is
    | Iterator<unknown, unknown, unknown>
    | AsyncIterator<unknown, unknown, unknown>
    | AsyncGenerator<unknown, unknown, unknown>
{
    if (! value) {
        return false
    }
    if (globalThis.Iterator && (value instanceof Iterator)) {
        return true
    }
    return (
        (value instanceof Object)
        && ('next' in value)
        && isFunction(value.next)
    )
}

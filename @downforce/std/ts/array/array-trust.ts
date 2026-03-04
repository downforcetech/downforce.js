import {isArray} from './array-is.js'

export function trustArray(value: unknown): undefined | Array<unknown> {
    if (isArray(value)) {
        return value
    }
    return
}

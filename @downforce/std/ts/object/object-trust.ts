import {isObject} from './object-is.js'

export function trustObject(value: unknown): undefined | Record<PropertyKey, unknown> {
    if (isObject(value)) {
        return value
    }
    return
}

import {isArray} from '../array.js'
import {isObject} from '../object.js'

export function cloneShallow<T>(value: T): T {
    if (isArray(value)) {
        return [...value] as unknown as T
    }
    if (isObject(value)) {
        return {...value} as unknown as T
    }
    return value
}

export function cloneDeep<T>(value: T): T {
    return structuredClone(value)
}

export function cloneDeepSerializable<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T
}

import {isArray} from '../array/array-is.js'
import {lastOf} from '../array/array-mix.js'
import {isObject} from './object-is.js'

export function getObjectPath(root: ObjectRoot, path: ObjectPath): unknown {
    let node = root as unknown

    for (const part of path) {
        if (! isObject(node) && ! isArray(node)) {
            return
        }
        node = node[part as any]
    }

    return node
}

export function setObjectPath(root: ObjectRoot, path: ObjectPath, newValue: unknown): unknown {
    let node = root as ObjectRoot

    for (const part of path.slice(0, -1)) {
        node = node[part as any] as ObjectRoot
    }

    const lastPart = lastOf(path)

    const oldValue = node[lastPart as any]
    node[lastPart as any] = newValue

    return oldValue
}

// Types ///////////////////////////////////////////////////////////////////////

export type ObjectRoot = Record<PropertyKey, unknown> | Array<unknown>
export type ObjectPath = Array<string | number>

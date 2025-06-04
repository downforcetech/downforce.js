import type {ObjectPath} from './object-path.js'

export const ObjectPathArrayOpenRegexp: RegExp = /\[/g
export const ObjectPathArrayCloseRegexp: RegExp = /\]/g
export const ObjectPathCache: Record<string, ObjectPath> = {}

/** @deprecated */
export function objectPathFromString(path: string): ObjectPath {
    const cacheValue = ObjectPathCache[path]

    if (cacheValue) {
        return cacheValue
    }

    const value = path
        .replace(ObjectPathArrayOpenRegexp, '.#')
        .replace(ObjectPathArrayCloseRegexp, '')
        .split('.')
        .map(it => {
            if (! it.startsWith('#')) {
                return it
            }
            return Number(it.slice(1))
        })

    ObjectPathCache[path] = value

    return value
}

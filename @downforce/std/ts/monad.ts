import {isObject} from './object.js'

export const MonadTag = '#__kind__$' // We can't use a Symbol or Class, because it must be serializable.

export function isMonad(value: unknown): value is Monad<string | number> {
    return isObject(value) && (MonadTag in value)
}

export function isMonadType<const T extends string | number>(value: unknown, tag: T): value is Monad<T> {
    return isMonad(value) && value[MonadTag] === tag
}

// Types ///////////////////////////////////////////////////////////////////////

export interface Monad<T extends string | number> {
    [MonadTag]: T
}

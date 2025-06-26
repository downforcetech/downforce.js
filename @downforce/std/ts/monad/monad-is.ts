import {isObject} from '../object/object-is.js'
import {MonadTag} from './monad-tag.js'
import type {Monad} from './monad-type.js'

export function isMonad(value: unknown): value is Monad {
    return isObject(value) && (MonadTag in value)
}

export function isMonadType<M extends Monad>(value: unknown, tag: string): value is M {
    return isMonad(value) && value[MonadTag] === tag
}

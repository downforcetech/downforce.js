import {isObject} from './object.js'

export const MonadTag = '#__std/kind__#' as const // We can't use a Symbol or Class, because it must be serializable.

export function createMonad<M extends Monad, P extends object = {}>(tag: string, props: P): M & P
export function createMonad<M extends Monad, P extends object = {}>(tag: string, props?: undefined): M
export function createMonad<M extends Monad, P extends object = {}>(tag: string, props?: undefined | P): M & P {
    return {[MonadTag]: tag, ...props} as M & P
}

export function isMonad(value: unknown): value is Monad {
    return isObject(value) && (MonadTag in value)
}

export function isMonadType<M extends Monad>(value: unknown, tag: string): value is M {
    return isMonad(value) && value[MonadTag] === tag
}

// Types ///////////////////////////////////////////////////////////////////////

export interface Monad<T extends string = string> {
    [MonadTag]: T
}

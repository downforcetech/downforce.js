import {MonadTag} from './monad-tag.js'
import type {Monad} from './monad-type.js'

export function createMonad<M extends Monad, P extends object = {}>(tag: string, props: P): M & P
export function createMonad<M extends Monad, P extends object = {}>(tag: string, props?: undefined): M
export function createMonad<M extends Monad, P extends object = {}>(tag: string, props?: undefined | P): M & P {
    return {[MonadTag]: tag, ...props} as M & P
}

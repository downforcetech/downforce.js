import type {MonadTag} from './monad-tag.js'

// Types ///////////////////////////////////////////////////////////////////////

export interface Monad<T extends string = string> {
    [MonadTag]: T
}

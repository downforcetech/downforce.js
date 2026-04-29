import type {Options} from '@downforce/std/type'
import type {CableStoreGeneric} from './cable-types.js'

// Types ///////////////////////////////////////////////////////////////////////

export type CableDecoder<I, S extends CableStoreGeneric> = (input: I) => undefined | Options<S>

export interface CablePlugInterface<S extends CableStoreGeneric> {
    load(): undefined | Options<S> | Promise<undefined | Options<S>>
    // watch(): TaskSync | TaskAsync
}

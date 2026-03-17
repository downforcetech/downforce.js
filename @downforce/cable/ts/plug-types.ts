import type {ObjectPartial} from '@downforce/std/type'
import type {CableStoreGeneric} from './cable-types.js'

// Types ///////////////////////////////////////////////////////////////////////

export type CableDecoder<I, S extends CableStoreGeneric> = (input: I) => undefined | ObjectPartial<S>

export interface CablePlugInterface<S extends CableStoreGeneric> {
    load(): undefined | ObjectPartial<S> | Promise<undefined | ObjectPartial<S>>
    // watch(): TaskSync | TaskAsync
}

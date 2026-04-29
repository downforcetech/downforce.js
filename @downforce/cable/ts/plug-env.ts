import type {Options} from '@downforce/std/type'
import type {CableStoreGeneric} from './cable-types.js'
import type {CableDecoder, CablePlugInterface} from './plug-types.js'

export class CableEnvPlug<S extends CableStoreGeneric> implements CablePlugInterface<S> {
    env: CableEnvPlugDict
    decoder: CableDecoder<CableEnvPlugDict, S>
    options: undefined | CableEnvPlugOptions

    constructor(
        env: CableEnvPlugDict,
        decoder: CableDecoder<CableEnvPlugDict, S>,
        options?: undefined | CableEnvPlugOptions,
    ) {
        this.env = env
        this.decoder = decoder
        this.options = options
    }

    async load(): Promise<undefined | Options<S>> {
        return this.decoder(this.env)
    }
}

// Types ///////////////////////////////////////////////////////////////////////

export interface CableEnvPlugOptions {
}

export type CableEnvPlugDict = Record<string, undefined | string>

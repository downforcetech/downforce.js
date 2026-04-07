import type {ObjectPartial} from '@downforce/std/type'
import type {CableStoreGeneric} from './cable-types.js'
import type {CableDecoder, CablePlugInterface} from './plug-types.js'

export class CableJsFilePlug<S extends CableStoreGeneric> implements CablePlugInterface<S> {
    filePath: string
    decoder: CableDecoder<unknown, S>
    options: undefined | CableJsFilePlugOptions

    constructor(
        filePath: string,
        decoder: CableDecoder<unknown, S>,
        options?: undefined | CableJsFilePlugOptions,
    ) {
        this.filePath = filePath
        this.decoder = decoder
        this.options = options
    }

    async load(): Promise<undefined | ObjectPartial<S>> {
        const contentJs = await import(this.filePath).then(it => it.default).catch(error => {
            this.options?.onFileError?.(this.filePath, error)
        })

        if (! contentJs) {
            return
        }

        this.options?.onFileImport?.(this.filePath)

        return this.decoder(contentJs)
    }
}

// Types ///////////////////////////////////////////////////////////////////////

export interface CableJsFilePlugOptions {
    onFileError?: undefined | ((filePath: string, error: unknown) => undefined)
    onFileImport?: undefined | ((filePath: string) => undefined)
}

import {tryCatch} from '@downforce/std/fn'
import type {ObjectPartial} from '@downforce/std/type'
import Fs from 'node:fs/promises'
import type {CableStoreGeneric} from './cable-types.js'
import type {CableDecoder, CablePlugInterface} from './plug-types.js'

export class CableJsonFilePlug<S extends CableStoreGeneric> implements CablePlugInterface<S> {
    filePath: string
    decoder: CableDecoder<unknown, S>
    options: undefined | CableJsonFilePlugOptions

    constructor(
        filePath: string,
        decoder: CableDecoder<unknown, S>,
        options?: undefined | CableJsonFilePlugOptions,
    ) {
        this.filePath = filePath
        this.decoder = decoder
        this.options = options
    }

    async load(): Promise<undefined | ObjectPartial<S>> {
        const contentRaw = await Fs.readFile(this.filePath, {encoding: 'utf-8', flag: 'r'}).catch(error => {
            this.options?.onFileError?.(this.filePath, error)
        })

        if (! contentRaw) {
            return
        }

        this.options?.onFileFound?.(this.filePath)

        const contentJson = tryCatch(
            () => JSON.parse(contentRaw) as unknown,
            error => void this.options?.onParseError?.(this.filePath, error),
        )

        return this.decoder(contentJson)
    }
}

// Types ///////////////////////////////////////////////////////////////////////

export interface CableJsonFilePlugOptions {
    onFileError?: undefined | ((filePath: string, error: unknown) => void)
    onFileFound?: undefined | ((filePath: string) => void)
    onParseError?: undefined | ((filePath: string, error: unknown) => void)
}

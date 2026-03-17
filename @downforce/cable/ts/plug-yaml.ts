import {tryCatch} from '@downforce/std/fn'
import type {ObjectPartial} from '@downforce/std/type'
import Fs from 'node:fs/promises'
import Yaml from 'yaml'
import type {CableStoreGeneric} from './cable-types.js'
import type {CableDecoder, CablePlugInterface} from './plug-types.js'

export class CableYamlFilePlug<S extends CableStoreGeneric> implements CablePlugInterface<S> {
    filePath: string
    decoder: CableDecoder<unknown, S>
    options: undefined | CableYamlFilePlugOptions

    constructor(
        filePath: string,
        decoder: CableDecoder<unknown, S>,
        options?: undefined | CableYamlFilePlugOptions,
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

        const contentYaml = tryCatch(
            () => Yaml.parse(contentRaw) as unknown,
            error => void this.options?.onParseError?.(this.filePath, error),
        )

        return this.decoder(contentYaml)
    }
}

// Types ///////////////////////////////////////////////////////////////////////

export interface CableYamlFilePlugOptions {
    onFileError?: undefined | ((filePath: string, error: unknown) => void)
    onFileFound?: undefined | ((filePath: string) => void)
    onParseError?: undefined | ((filePath: string, error: unknown) => void)
}

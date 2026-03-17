import type {CableStoreGeneric} from './cable-types.js'
import {CableEnvPlug, type CableEnvPlugOptions} from './plug-env.js'
import {CableJsFilePlug, type CableJsFilePlugOptions} from './plug-js.js'
import {CableJsonFilePlug, type CableJsonFilePlugOptions} from './plug-json.js'
import {CableTomlFilePlug, type CableTomlFilePlugOptions} from './plug-toml.js'
import type {CableDecoder, CablePlugInterface} from './plug-types.js'
import {CableYamlFilePlug, type CableYamlFilePlugOptions} from './plug-yaml.js'

export const CablePlug = {
    Env<S extends CableStoreGeneric>(
        env: Record<string, undefined | string>,
        decoder: CableDecoder<Record<string, undefined | string>, S>,
        options?: undefined | CableEnvPlugOptions,
    ): CablePlugInterface<S> {
        return new CableEnvPlug(env, decoder, options)
    },
    JsFile<S extends CableStoreGeneric>(
        filePath: string,
        decoder: CableDecoder<unknown, S>,
        options?: undefined | CableJsFilePlugOptions,
    ): CablePlugInterface<S> {
        return new CableJsFilePlug(filePath, decoder, options)
    },
    JsonFile<S extends CableStoreGeneric>(
        filePath: string,
        decoder: CableDecoder<unknown, S>,
        options?: undefined | CableJsonFilePlugOptions,
    ): CablePlugInterface<S> {
        return new CableJsonFilePlug(filePath, decoder, options)
    },
    TomlFile<S extends CableStoreGeneric>(
        filePath: string,
        decoder: CableDecoder<unknown, S>,
        options?: undefined | CableTomlFilePlugOptions,
    ): CablePlugInterface<S> {
        return new CableTomlFilePlug(filePath, decoder, options)
    },
    YamlFile<S extends CableStoreGeneric>(
        filePath: string,
        decoder: CableDecoder<unknown, S>,
        options?: undefined | CableYamlFilePlugOptions,
    ): CablePlugInterface<S> {
        return new CableYamlFilePlug(filePath, decoder, options)
    },
}

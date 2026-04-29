import {
    Cable,
    CableEnvPlug,
    CableJsFilePlug,
    CableJsonFilePlug,
    CablePlug,
    CableTomlFilePlug,
    CableYamlFilePlug,
    listPathHierarchy,
    type CableEnvPlugDict,
    type CableEnvPlugOptions,
    type CableJsFilePlugOptions,
    type CableJsonFilePlugOptions,
    type CableTomlFilePlugOptions,
} from '@downforce/cable'
import {noop, pipe} from '@downforce/std/fn'
import {TypeStrict as TS, TypeTrust as TT, type Options} from '@downforce/std/type'
import Assert from 'node:assert/strict'
import Path from 'node:path'
import Process from 'node:process'
import {describe, mock, test} from 'node:test'

const Dirname = import.meta.dirname

const resources = {
    badMissingFile:Path.join(Dirname, 'data', '.missing'),
    badParsedFile:Path.join(Dirname, 'data', 'broken.txt'),
    envData: await import('./data/plug.env.ts').then(it => it.default),
    jsFile:Path.join(Dirname, 'data', 'plug.ts'),
    jsonFile:Path.join(Dirname, 'data', 'plug.json'),
    tomlFile:Path.join(Dirname, 'data', 'plug.toml'),
    yamlFile:Path.join(Dirname, 'data', 'plug.yaml'),
}
const partials = {
    '1_envPartialData': await import('./data/pipe-1.env.ts').then(it => it.default),
    '2_jsPartialFile':Path.join(Dirname, 'data', 'pipe-2.ts'),
    '3_jsonPartialFile':Path.join(Dirname, 'data', 'pipe-3.json'),
    '4_tomlPartialFile':Path.join(Dirname, 'data', 'pipe-4.toml'),
    '5_yamlPartialFile':Path.join(Dirname, 'data', 'pipe-5.yaml'),
}

interface DataInterface {
    address: string
    log: boolean
    log_file: string
    mode: 'development' | 'production'
    port: number
    secret: undefined | string
}

function createDefaults(): DataInterface {
    return {
        address: '0.0.0.0',
        log: false,
        log_file: '/dev/null',
        mode: 'development',
        port: 80,
        secret: undefined,
    }
}
const dataDecoders = {
    decodeEnv(env: CableEnvPlugDict): Options<DataInterface> {
        return {
            address: TS.strictString(env.DATA_ADDRESS),
            log: TS.strictBooleanLike(env.DATA_LOG),
            log_file: TS.strictString(env.DATA_LOG_FILE),
            mode: TS.strictEnum(env.DATA_MODE, ['development', 'production']),
            port: TS.strictNumberLike(env.DATA_PORT),
            secret: TS.strictString(env.DATA_SECRET),
        }
    },
    decodeJs(js: unknown): Options<DataInterface> {
        return pipe(js, TT.trustObject, (root): Options<DataInterface> => ({
            address: TT.trustString(root?.address),
            log: TT.trustBoolean(root?.log),
            log_file: TT.trustString(root?.log_file),
            mode: TT.trustEnum(root?.mode, ['development', 'production']),
            port: TT.trustNumber(root?.port),
            secret: TT.trustString(root?.secret),
        }))
    },
    decodeJson(json: unknown): Options<DataInterface> {
        return pipe(json, TT.trustObject, (root): Options<DataInterface> => ({
            address: TT.trustString(root?.address),
            log: TT.trustBoolean(root?.log),
            log_file: TT.trustString(root?.log_file),
            mode: TT.trustEnum(root?.mode, ['development', 'production']),
            port: TT.trustNumber(root?.port),
            secret: TT.trustString(root?.secret),
        }))
    },
    decodeToml(yaml: unknown): Options<DataInterface> {
        return pipe(yaml, TT.trustObject, (root): Options<DataInterface> => ({
            address: TT.trustString(root?.address),
            log: TT.trustBoolean(root?.log),
            log_file: TT.trustString(root?.log_file),
            mode: TT.trustEnum(root?.mode, ['development', 'production']),
            port: TT.trustNumber(root?.port),
            secret: TT.trustString(root?.secret),
        }))
    },
    decodeYaml(yaml: unknown): Options<DataInterface> {
        return pipe(yaml, TT.trustObject, (root): Options<DataInterface> => ({
            address: TT.trustString(root?.address),
            log: TT.trustBoolean(root?.log),
            log_file: TT.trustString(root?.log_file),
            mode: TT.trustEnum(root?.mode, ['development', 'production']),
            port: TT.trustNumber(root?.port),
            secret: TT.trustString(root?.secret),
        }))
    },
}

describe('@downforce/cable', (ctx) => {
    test('Cable resolves using defaults', async (ctx) => {
        const cable = new Cable(createDefaults)

        const keysValues = await cable.resolve()

        Assert.equal(keysValues.address, '0.0.0.0')
        Assert.equal(keysValues.log, false)
        Assert.equal(keysValues.log_file, '/dev/null')
        Assert.equal(keysValues.mode, 'development')
        Assert.equal(keysValues.port, 80)
        Assert.equal(keysValues.secret, undefined)
    })

    test('Cable resolves using CableEnvPlug', async (ctx) => {
        const cable = new Cable(createDefaults)

        cable.use(
            new CableEnvPlug(resources.envData, dataDecoders.decodeEnv),
        )

        const keysValues = await cable.resolve()

        Assert.equal(keysValues.address, 'localhost')
        Assert.equal(keysValues.log, true)
        Assert.equal(keysValues.log_file, 'out.log')
        Assert.equal(keysValues.mode, 'production')
        Assert.equal(keysValues.port, 8080)
        Assert.equal(keysValues.secret, 'very-secret')
    })

    test('Cable resolves using CableJsFilePlug', async (ctx) => {
        const cable = new Cable(createDefaults)

        cable.use(
            new CableJsFilePlug(resources.jsFile, dataDecoders.decodeJs),
        )

        const keysValues = await cable.resolve()

        Assert.equal(keysValues.address, 'localhost')
        Assert.equal(keysValues.log, true)
        Assert.equal(keysValues.log_file, 'out.log')
        Assert.equal(keysValues.mode, 'production')
        Assert.equal(keysValues.port, 8080)
        Assert.equal(keysValues.secret, 'very-secret')
    })

    test('Cable resolves using CableJsonFilePlug', async (ctx) => {
        const cable = new Cable(createDefaults)

        cable.use(
            new CableJsonFilePlug(resources.jsonFile, dataDecoders.decodeJson),
        )

        const keysValues = await cable.resolve()

        Assert.equal(keysValues.address, 'localhost')
        Assert.equal(keysValues.log, true)
        Assert.equal(keysValues.log_file, 'out.log')
        Assert.equal(keysValues.mode, 'production')
        Assert.equal(keysValues.port, 8080)
        Assert.equal(keysValues.secret, 'very-secret')
    })

    test('Cable resolves using CableTomlFilePlug', async (ctx) => {
        const cable = new Cable(createDefaults)

        cable.use(
            new CableTomlFilePlug(resources.tomlFile, dataDecoders.decodeToml),
        )

        const keysValues = await cable.resolve()

        Assert.equal(keysValues.address, 'localhost')
        Assert.equal(keysValues.log, true)
        Assert.equal(keysValues.log_file, 'out.log')
        Assert.equal(keysValues.mode, 'production')
        Assert.equal(keysValues.port, 8080)
        Assert.equal(keysValues.secret, 'very-secret')
    })

    test('Cable resolves using CableYamlFilePlug', async (ctx) => {
        const cable = new Cable(createDefaults)

        cable.use(
            new CableYamlFilePlug(resources.yamlFile, dataDecoders.decodeYaml),
        )

        const keysValues = await cable.resolve()

        Assert.equal(keysValues.address, 'localhost')
        Assert.equal(keysValues.log, true)
        Assert.equal(keysValues.log_file, 'out.log')
        Assert.equal(keysValues.mode, 'production')
        Assert.equal(keysValues.port, 8080)
        Assert.equal(keysValues.secret, 'very-secret')
    })

    test('Cable resolves using plugs list', async (ctx) => {
        const cable = new Cable(createDefaults)

        cable.use(
            new CableEnvPlug(partials['1_envPartialData'], dataDecoders.decodeEnv),
            new CableJsFilePlug(partials['2_jsPartialFile'], dataDecoders.decodeJs),
            new CableJsonFilePlug(partials['3_jsonPartialFile'], dataDecoders.decodeJson),
            new CableTomlFilePlug(partials['4_tomlPartialFile'], dataDecoders.decodeToml),
            new CableYamlFilePlug(partials['5_yamlPartialFile'], dataDecoders.decodeYaml),
        )

        const keysValues = await cable.resolve()

        Assert.equal(keysValues.address, 'local.env')
        Assert.equal(keysValues.log, true)
        Assert.equal(keysValues.log_file, 'log.json')
        Assert.equal(keysValues.mode, 'production')
        Assert.equal(keysValues.port, 8080)
        Assert.equal(keysValues.secret, 'yaml-secret')
    })

    test('CablePlug.Env() instantiates CableEnvPlug', (ctx) => {
        const options: CableEnvPlugOptions = {}
        const plug = CablePlug.Env(resources.envData, dataDecoders.decodeEnv, options)

        Assert(plug instanceof CableEnvPlug)
        Assert.equal(plug.env, resources.envData)
        Assert.equal(plug.decoder, dataDecoders.decodeEnv)
    })

    test('CablePlug.JsFile() instantiates CableJsFilePlug', (ctx) => {
        const options: CableJsFilePlugOptions = {
            onFileError() {},
            onFileImport() {},
        }
        const plug = CablePlug.JsFile(resources.jsonFile, dataDecoders.decodeJson, options)

        Assert(plug instanceof CableJsFilePlug)
        Assert.equal(plug.filePath, resources.jsonFile)
        Assert.equal(plug.decoder, dataDecoders.decodeJson)
        Assert.equal(plug.options?.onFileError, options.onFileError)
        Assert.equal(plug.options?.onFileImport, options.onFileImport)
    })

    test('CablePlug.JsonFile() instantiates CableJsonFilePlug', (ctx) => {
        const options: CableJsonFilePlugOptions = {
            onFileError() {},
            onFileFound() {},
            onParseError() {},
        }
        const plug = CablePlug.JsonFile(resources.jsonFile, dataDecoders.decodeJson, options)

        Assert(plug instanceof CableJsonFilePlug)
        Assert.equal(plug.filePath, resources.jsonFile)
        Assert.equal(plug.decoder, dataDecoders.decodeJson)
        Assert.equal(plug.options?.onFileError, options.onFileError)
        Assert.equal(plug.options?.onFileFound, options.onFileFound)
        Assert.equal(plug.options?.onParseError, options.onParseError)
    })

    test('CablePlug.TomlFile() instantiates CableTomlFilePlug', (ctx) => {
        const options: CableTomlFilePlugOptions = {
            onFileError() {},
            onFileFound() {},
            onParseError() {},
        }
        const plug = CablePlug.TomlFile(resources.tomlFile, dataDecoders.decodeToml, options)

        Assert(plug instanceof CableTomlFilePlug)
        Assert.equal(plug.filePath, resources.tomlFile)
        Assert.equal(plug.decoder, dataDecoders.decodeToml)
        Assert.equal(plug.options?.onFileError, options.onFileError)
        Assert.equal(plug.options?.onFileFound, options.onFileFound)
        Assert.equal(plug.options?.onParseError, options.onParseError)
    })

    test('CablePlug.YamlFile() instantiates CableYamlFilePlug', (ctx) => {
        const options: CableJsonFilePlugOptions = {
            onFileError() {},
            onFileFound() {},
            onParseError() {},
        }
        const plug = CablePlug.YamlFile(resources.yamlFile, dataDecoders.decodeYaml, options)

        Assert(plug instanceof CableYamlFilePlug)
        Assert.equal(plug.filePath, resources.yamlFile)
        Assert.equal(plug.decoder, dataDecoders.decodeYaml)
        Assert.equal(plug.options?.onFileError, options.onFileError)
        Assert.equal(plug.options?.onFileFound, options.onFileFound)
        Assert.equal(plug.options?.onParseError, options.onParseError)
    })

    test('CableEnvPlug accepts node:process env', async (ctx) => {
        const cable = new Cable(createDefaults)

        Process.env['DATA_ADDRESS'] = 'localhost'
        Process.env['DATA_LOG'] = 'true'
        Process.env['DATA_LOG_FILE'] = 'out.log'
        Process.env['DATA_MODE'] = 'production'
        Process.env['DATA_PORT'] = '8080'
        Process.env['DATA_SECRET'] = 'very-secret'

        cable.use(
            new CableEnvPlug(Process.env, dataDecoders.decodeEnv),
        )

        const keysValues = await cable.resolve()

        Assert.equal(keysValues.address, 'localhost')
        Assert.equal(keysValues.log, true)
        Assert.equal(keysValues.log_file, 'out.log')
        Assert.equal(keysValues.mode, 'production')
        Assert.equal(keysValues.port, 8080)
        Assert.equal(keysValues.secret, 'very-secret')
    })

    test('CableJsFilePlug runs options callbacks', async (ctx) => {
        {
            const cable = new Cable(createDefaults)
            const spies = {
                onFileError: mock.fn(noop),
                onFileImport: mock.fn(noop),
            }

            cable.use(
                new CableJsFilePlug(resources.jsFile, dataDecoders.decodeJs, {
                    onFileError(error) {
                        spies.onFileError()
                        Assert.fail('onFileError')
                    },
                    onFileImport(filePath) {
                        spies.onFileImport()
                        Assert.equal(filePath, resources.jsFile)
                    },
                }),
            )

            const keysValues = await cable.resolve()

            Assert.equal(spies.onFileError.mock.callCount(), 0)
            Assert.equal(spies.onFileImport.mock.callCount(), 1)
        }
        {
            const cable = new Cable(createDefaults)
            const spies = {
                onFileError: mock.fn(noop),
                onFileImport: mock.fn(noop),
            }

            cable.use(
                new CableJsFilePlug(resources.badMissingFile, dataDecoders.decodeJs, {
                    onFileError(filePath, error) {
                        spies.onFileError()
                        Assert.equal(filePath, resources.badMissingFile)
                        Assert(error)
                    },
                    onFileImport(filePath) {
                        spies.onFileImport()
                        Assert.fail('onFileImport')
                    },
                }),
            )

            const keysValues = await cable.resolve()

            Assert.equal(spies.onFileError.mock.callCount(), 1)
            Assert.equal(spies.onFileImport.mock.callCount(), 0)
        }

        {
            const cable = new Cable(createDefaults)
            const spies = {
                onFileError: mock.fn(noop),
                onFileImport: mock.fn(noop),
            }

            cable.use(
                new CableJsFilePlug(resources.badParsedFile, dataDecoders.decodeJs, {
                    onFileError(filePath, error) {
                        spies.onFileError()
                        Assert.equal(filePath, resources.badParsedFile)
                        Assert(error)
                    },
                    onFileImport(filePath) {
                        spies.onFileImport()
                        Assert.equal(filePath, resources.badParsedFile)
                    },
                }),
            )

            const keysValues = await cable.resolve()

            Assert.equal(spies.onFileError.mock.callCount(), 1)
            Assert.equal(spies.onFileImport.mock.callCount(), 0)
        }
    })

    test('CableJsonFilePlug runs options callbacks', async (ctx) => {
        {
            const cable = new Cable(createDefaults)
            const spies = {
                onFileError: mock.fn(noop),
                onFileFound: mock.fn(noop),
                onParseError: mock.fn(noop),
            }

            cable.use(
                new CableJsonFilePlug(resources.jsonFile, dataDecoders.decodeJson, {
                    onFileError(error) {
                        spies.onFileError()
                        Assert.fail('onFileError')
                    },
                    onFileFound(filePath) {
                        spies.onFileFound()
                        Assert.equal(filePath, resources.jsonFile)
                    },
                    onParseError(filePath, error) {
                        spies.onParseError()
                        Assert.fail('onParseError')
                    },
                }),
            )

            const keysValues = await cable.resolve()

            Assert.equal(spies.onFileError.mock.callCount(), 0)
            Assert.equal(spies.onFileFound.mock.callCount(), 1)
            Assert.equal(spies.onParseError.mock.callCount(), 0)
        }
        {
            const cable = new Cable(createDefaults)
            const spies = {
                onFileError: mock.fn(noop),
                onFileFound: mock.fn(noop),
                onParseError: mock.fn(noop),
            }

            cable.use(
                new CableJsonFilePlug(resources.badMissingFile, dataDecoders.decodeJson, {
                    onFileError(filePath, error) {
                        spies.onFileError()
                        Assert.equal(filePath, resources.badMissingFile)
                        Assert(error)
                    },
                    onFileFound(filePath) {
                        spies.onFileFound()
                        Assert.fail('onFileFound')
                    },
                    onParseError(filePath, error) {
                        spies.onParseError()
                        Assert.fail('onParseError')
                    },
                }),
            )

            const keysValues = await cable.resolve()

            Assert.equal(spies.onFileError.mock.callCount(), 1)
            Assert.equal(spies.onFileFound.mock.callCount(), 0)
            Assert.equal(spies.onParseError.mock.callCount(), 0)
        }

        {
            const cable = new Cable(createDefaults)
            const spies = {
                onFileError: mock.fn(noop),
                onFileFound: mock.fn(noop),
                onParseError: mock.fn(noop),
            }

            cable.use(
                new CableJsonFilePlug(resources.badParsedFile, dataDecoders.decodeJson, {
                    onFileError(filePath, error) {
                        spies.onFileError()
                        Assert.fail('onFileError')
                    },
                    onFileFound(filePath) {
                        spies.onFileFound()
                        Assert.equal(filePath, resources.badParsedFile)
                    },
                    onParseError(filePath, error) {
                        spies.onParseError()
                        Assert.equal(filePath, resources.badParsedFile)
                        Assert(error)
                    },
                }),
            )

            const keysValues = await cable.resolve()

            Assert.equal(spies.onFileError.mock.callCount(), 0)
            Assert.equal(spies.onFileFound.mock.callCount(), 1)
            Assert.equal(spies.onParseError.mock.callCount(), 1)
        }
    })

    test('CableTomlFilePlug runs options callbacks', async (ctx) => {
        {
            const cable = new Cable(createDefaults)
            const spies = {
                onFileError: mock.fn(noop),
                onFileFound: mock.fn(noop),
                onParseError: mock.fn(noop),
            }

            cable.use(
                new CableTomlFilePlug(resources.tomlFile, dataDecoders.decodeToml, {
                    onFileError(error) {
                        spies.onFileError()
                        Assert.fail('onFileError')
                    },
                    onFileFound(filePath) {
                        spies.onFileFound()
                        Assert.equal(filePath, resources.tomlFile)
                    },
                    onParseError(filePath, error) {
                        spies.onParseError()
                        Assert.fail('onParseError')
                    },
                }),
            )

            const keysValues = await cable.resolve()

            Assert.equal(spies.onFileError.mock.callCount(), 0)
            Assert.equal(spies.onFileFound.mock.callCount(), 1)
            Assert.equal(spies.onParseError.mock.callCount(), 0)
        }
        {
            const cable = new Cable(createDefaults)
            const spies = {
                onFileError: mock.fn(noop),
                onFileFound: mock.fn(noop),
                onParseError: mock.fn(noop),
            }

            cable.use(
                new CableTomlFilePlug(resources.badMissingFile, dataDecoders.decodeToml, {
                    onFileError(filePath, error) {
                        spies.onFileError()
                        Assert.equal(filePath, resources.badMissingFile)
                        Assert(error)
                    },
                    onFileFound(filePath) {
                        spies.onFileFound()
                        Assert.fail('onFileFound')
                    },
                    onParseError(filePath, error) {
                        spies.onParseError()
                        Assert.fail('onParseError')
                    },
                }),
            )

            const keysValues = await cable.resolve()

            Assert.equal(spies.onFileError.mock.callCount(), 1)
            Assert.equal(spies.onFileFound.mock.callCount(), 0)
            Assert.equal(spies.onParseError.mock.callCount(), 0)
        }

        {
            const cable = new Cable(createDefaults)
            const spies = {
                onFileError: mock.fn(noop),
                onFileFound: mock.fn(noop),
                onParseError: mock.fn(noop),
            }

            cable.use(
                new CableTomlFilePlug(resources.badParsedFile, dataDecoders.decodeToml, {
                    onFileError(filePath, error) {
                        spies.onFileError()
                        Assert.fail('onFileError')
                    },
                    onFileFound(filePath) {
                        spies.onFileFound()
                        Assert.equal(filePath, resources.badParsedFile)
                    },
                    onParseError(filePath, error) {
                        spies.onParseError()
                        Assert.equal(filePath, resources.badParsedFile)
                        Assert(error)
                    },
                }),
            )

            const keysValues = await cable.resolve()

            Assert.equal(spies.onFileError.mock.callCount(), 0)
            Assert.equal(spies.onFileFound.mock.callCount(), 1)
            Assert.equal(spies.onParseError.mock.callCount(), 1)
        }
    })

    test('CableYamlFilePlug runs options callbacks', async (ctx) => {
        {
            const cable = new Cable(createDefaults)
            const spies = {
                onFileError: mock.fn(noop),
                onFileFound: mock.fn(noop),
                onParseError: mock.fn(noop),
            }

            cable.use(
                new CableYamlFilePlug(resources.yamlFile, dataDecoders.decodeYaml, {
                    onFileError(error) {
                        spies.onFileError()
                        Assert.fail('onFileError')
                    },
                    onFileFound(filePath) {
                        spies.onFileFound()
                        Assert.equal(filePath, resources.yamlFile)
                    },
                    onParseError(filePath, error) {
                        spies.onParseError()
                        Assert.fail('onParseError')
                    },
                }),
            )

            const keysValues = await cable.resolve()

            Assert.equal(spies.onFileError.mock.callCount(), 0)
            Assert.equal(spies.onFileFound.mock.callCount(), 1)
            Assert.equal(spies.onParseError.mock.callCount(), 0)
        }
        {
            const cable = new Cable(createDefaults)
            const spies = {
                onFileError: mock.fn(noop),
                onFileFound: mock.fn(noop),
                onParseError: mock.fn(noop),
            }

            cable.use(
                new CableYamlFilePlug(resources.badMissingFile, dataDecoders.decodeYaml, {
                    onFileError(filePath, error) {
                        spies.onFileError()
                        Assert.equal(filePath, resources.badMissingFile)
                        Assert(error)
                    },
                    onFileFound(filePath) {
                        spies.onFileFound()
                        Assert.fail('onFileFound')
                    },
                    onParseError(filePath, error) {
                        spies.onParseError()
                        Assert.fail('onParseError')
                    },
                }),
            )

            const keysValues = await cable.resolve()

            Assert.equal(spies.onFileError.mock.callCount(), 1)
            Assert.equal(spies.onFileFound.mock.callCount(), 0)
            Assert.equal(spies.onParseError.mock.callCount(), 0)
        }

        {
            const cable = new Cable(createDefaults)
            const spies = {
                onFileError: mock.fn(noop),
                onFileFound: mock.fn(noop),
                onParseError: mock.fn(noop),
            }

            cable.use(
                new CableYamlFilePlug(resources.badParsedFile, dataDecoders.decodeYaml, {
                    onFileError(filePath, error) {
                        spies.onFileError()
                        Assert.fail('onFileError')
                    },
                    onFileFound(filePath) {
                        spies.onFileFound()
                        Assert.equal(filePath, resources.badParsedFile)
                    },
                    onParseError(filePath, error) {
                        spies.onParseError()
                        Assert.equal(filePath, resources.badParsedFile)
                        Assert(error)
                    },
                }),
            )

            const keysValues = await cable.resolve()

            Assert.equal(spies.onFileError.mock.callCount(), 0)
            Assert.equal(spies.onFileFound.mock.callCount(), 1)
            // Assert.equal(spies.onParseError.mock.callCount(), 1) // FIXME
        }
    })

    test('listPathHierarchy()', async (ctx) => {
        {
            const actual = listPathHierarchy('/')
            const expected = ['/']

            Assert.deepEqual(actual, expected)
        }
        {
            const actual = listPathHierarchy('/abc')
            const expected = ['/', '/abc']

            Assert.deepEqual(actual, expected)
        }
        {
            const actual = listPathHierarchy('/abc/')
            const expected = ['/', '/abc/']

            Assert.deepEqual(actual, expected)
        }
        {
            const actual = listPathHierarchy('/abc/xyz')
            const expected = ['/', '/abc/', '/abc/xyz']

            Assert.deepEqual(actual, expected)
        }
        {
            const actual = listPathHierarchy('/abc/xyz/')
            const expected = ['/', '/abc/', '/abc/xyz/']

            Assert.deepEqual(actual, expected)
        }
        {
            const actual = listPathHierarchy('.')
            const expected = ['.']

            Assert.deepEqual(actual, expected)
        }
        {
            const actual = listPathHierarchy('./')
            const expected = ['.']

            Assert.deepEqual(actual, expected)
        }
        {
            const actual = listPathHierarchy('./abc')
            const expected = ['.', './abc']

            Assert.deepEqual(actual, expected)
        }
        {
            const actual = listPathHierarchy('./abc/')
            const expected = ['.', './abc/']

            Assert.deepEqual(actual, expected)
        }
        {
            const actual = listPathHierarchy('./abc/xyz')
            const expected = ['.', './abc/', './abc/xyz']

            Assert.deepEqual(actual, expected)
        }
        {
            const actual = listPathHierarchy('./abc/xyz/')
            const expected = ['.', './abc/', './abc/xyz/']

            Assert.deepEqual(actual, expected)
        }
        {
            const actual = listPathHierarchy('abc')
            const expected = ['.', './abc']

            Assert.deepEqual(actual, expected)
        }
        {
            const actual = listPathHierarchy('abc/')
            const expected = ['.', './abc/']

            Assert.deepEqual(actual, expected)
        }
        {
            const actual = listPathHierarchy('abc/xyz')
            const expected = ['.', './abc/', './abc/xyz']

            Assert.deepEqual(actual, expected)
        }
        {
            const actual = listPathHierarchy('abc/xyz/')
            const expected = ['.', './abc/', './abc/xyz/']

            Assert.deepEqual(actual, expected)
        }
        {
            const actual = listPathHierarchy('c:\\abc\\xyz', {separator: '\\'})
            const expected = ['c:\\', 'c:\\abc\\', 'c:\\abc\\xyz']

            Assert.deepEqual(actual, expected)
        }
        {
            const actual = listPathHierarchy('~abc~xyz~', {reverse: true, separator: '~'})
            const expected = ['~abc~xyz~', '~abc~', '~']

            Assert.deepEqual(actual, expected)
        }
    })
})

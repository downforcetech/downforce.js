import {assertArray} from '../array/array-assert.js'
import {isArray} from '../array/array-is.js'
import {arrayWrap} from '../array/array-mix.js'
import {isPrimitive} from '../mix/mix-is.js'
import {isObject} from '../object/object-is.js'
import {getObjectPath, setObjectPath, type ObjectPath} from '../object/object-path.js'
import {assertDefined} from '../optional/optional-assert.js'
import {deserializeFromJson, serializeAsJson} from './serial-mix.js'
import {SerialSyncBuiltinCodec} from './serial-sync.js'
import type {SerialCodecId, SerialStackEntry} from './serial-type.js'

export const SerialAsyncBuiltinCodec: {
    Date: SerialAsyncCodec<Date, number>
    Url: SerialAsyncCodec<URL, string>
    RegExp: SerialAsyncCodec<RegExp, string>
    Infinity: SerialAsyncCodec<typeof Infinity, number>
    Map: SerialAsyncCodec<Map<unknown, unknown>, Array<[unknown, unknown]>>
    Set: SerialAsyncCodec<Set<unknown>, Array<unknown>>
} = {
    ...SerialSyncBuiltinCodec,
}

export const SerialAsyncBuiltinCodecsList: Array<SerialAsyncCodec> = Object.values(SerialAsyncBuiltinCodec)

export async function serializeStructAsync(
    payload: unknown,
    codecsOptional?: undefined | Array<SerialAsyncCodec>,
): Promise<string> {
    const codecs = codecsOptional ?? SerialAsyncBuiltinCodecsList
    const stack: Array<SerialStackEntry> = []

    const data = await visitSerializableStructAsync(payload, {codecs: codecs, path: [], stack: stack})

    return serializeAsJson({data: data, meta: stack})
}

export async function visitSerializableStructAsync(node: unknown, ctx: SerialAsyncCodecContext): Promise<unknown> {
    if (isPrimitive(node)) {
        return node
    }
    if (isArray(node)) {
        const list: Array<unknown> = []
        const listSize = node.length

        for (let idx = 0; idx < listSize; ++idx) {
            const value = node[idx]
            const valueSerialized = await visitSerializableStructAsync(value, {...ctx, path: [...ctx.path, idx]})

            list.push(valueSerialized)
        }

        return list
    }
    for (const codec of ctx.codecs) {
        const codecDidMatch = codec.is(node)

        if (! codecDidMatch) {
            continue
        }

        const valueEncoded = await codec.encode(node, ctx)
        const valueEncodedDeep = await visitSerializableStructAsync(valueEncoded, ctx)

        ctx.stack.push([codec.id, ctx.path])

        return valueEncodedDeep
    }
    if (isObject(node)) {
        const object: Record<string, unknown> = {...node}

        for (const [key, value] of Object.entries(node)) {
            // Symbol keys are not supported because not serializable.
            const valueSerialized = await visitSerializableStructAsync(value, {...ctx, path: [...ctx.path, key]})

            object[key] = valueSerialized
        }

        return object
    }
    return node
}

export async function deserializeStructAsync(
    payloadSerialized: string,
    codecsOptional?: undefined | Array<SerialAsyncCodec>,
): Promise<unknown> {
    const codecs: Array<SerialAsyncCodec> = codecsOptional ?? SerialAsyncBuiltinCodecsList

    const payload: any = deserializeFromJson(payloadSerialized)
    const data = payload?.data
    const meta = arrayWrap(payload?.meta)

    if (! meta) {
        return data
    }

    assertArray(meta)

    for (const rule of meta) {
        assertArray(rule)

        const [codecId, path] = rule as SerialStackEntry

        assertArray(path)
        assertDefined(codecId)

        const codec = codecs.find(it => it.id === codecId)

        assertDefined(codec)

        const valueEncoded = getObjectPath(data, path)
        const valueDecoded = await codec.decode(valueEncoded)

        setObjectPath(data, path, valueDecoded)
    }

    return payload?.data
}

// Types ///////////////////////////////////////////////////////////////////////

export interface SerialAsyncCodec<T = unknown, E = unknown> {
    id: SerialCodecId
    is(value: unknown): value is T
    encode(value: T, ctx: SerialAsyncCodecContext): E | Promise<E>
    decode(valueEncoded: E): T | Promise<T>
}

export interface SerialAsyncCodecContext {
    codecs: Array<SerialAsyncCodec>
    path: ObjectPath
    stack: Array<SerialStackEntry>
}

import {assertArray} from '../array/array-assert.js'
import {isArray} from '../array/array-is.js'
import {arrayWrap} from '../array/array-mix.js'
import {asDate} from '../date/date-mix.js'
import {isPrimitive} from '../mix/mix-is.js'
import {isObject} from '../object/object-is.js'
import type {ObjectPath} from '../object/object-path.js'
import {getObjectPath, setObjectPath} from '../object/object-path.js'
import {assertDefined} from '../optional/optional-assert.js'
import {deserializeFromJson, serializeAsJson} from './serial-mix.js'
import type {SerialCodecId, SerialStackEntry} from './serial-type.js'

export const SerialSyncBuiltinCodec: {
    Date: SerialSyncCodec<Date, number>
    Url: SerialSyncCodec<URL, string>
    RegExp: SerialSyncCodec<RegExp, string>
    Infinity: SerialSyncCodec<typeof Infinity, number>
    Map: SerialSyncCodec<Map<unknown, unknown>, Array<[unknown, unknown]>>
    Set: SerialSyncCodec<Set<unknown>, Array<unknown>>
} = {
    Date: {
        id: 'Date',
        is(value) {
            return value instanceof Date
        },
        encode(date) {
            return date.getTime()
        },
        decode(dateEncoded) {
            return asDate(dateEncoded)
        },
    },
    Url: {
        id: 'Url',
        is(value) {
            return value instanceof URL
        },
        encode(url) {
            return url.toString()
        },
        decode(urlEncoded) {
            return new URL(urlEncoded)
        },
    },
    RegExp: {
        id: 'RegExp',
        is(value) {
            return value instanceof RegExp
        },
        encode(regexp) {
            return String(regexp)
        },
        decode(regexpEncoded) {
            const lastSlashIdx = regexpEncoded.lastIndexOf('/')
            const regexpString = regexpEncoded.slice(1, lastSlashIdx) // 1 removes first '/'.
            const regexpFlags = regexpEncoded.slice(lastSlashIdx + 1)

            return new RegExp(regexpString, regexpFlags)
        },
    },
    Infinity: {
        id: 'Infinity',
        is(value): value is number {
            return value === +Infinity || value === -Infinity
        },
        encode(infinity) {
            if (infinity === +Infinity) {
                return +1
            }
            if (infinity === -Infinity) {
                return -1
            }
            return 0
        },
        decode(infinityEncoded) {
            switch (infinityEncoded) {
                case +1: return +Infinity
                case -1: return -Infinity
            }
            return 0
        },
    },
    Map: {
        id: 'Map',
        is(value) {
            return value instanceof Map
        },
        encode(map, ctx) {
            return Array.from(map.entries()).map((entry, idx) => entry)
        },
        decode(mapEncoded) {
            return new Map(mapEncoded)
        },
    },
    Set: {
        id: 'Set',
        is(value) {
            return value instanceof Set
        },
        encode(set, ctx) {
            return Array.from(set.values()).map((value, idx) => value)
        },
        decode(setEncoded) {
            return new Set(setEncoded)
        },
    },
}

export const SerialSyncBuiltinCodecsList: Array<SerialSyncCodec> = Object.values(SerialSyncBuiltinCodec)

export function serializeStructSync(
    payload: unknown,
    codecsOptional?: undefined | Array<SerialSyncCodec>,
): string {
    const codecs = codecsOptional ?? SerialSyncBuiltinCodecsList
    const stack: Array<SerialStackEntry> = []

    const data = visitSerializableStructSync(payload, {codecs: codecs, path: [], stack: stack})

    return serializeAsJson({data: data, meta: stack})
}

export function visitSerializableStructSync(node: unknown, ctx: SerialSyncCodecContext): unknown {
    if (isPrimitive(node)) {
        return node
    }
    if (isArray(node)) {
        const list: Array<unknown> = []
        const listSize = node.length

        for (let idx = 0; idx < listSize; ++idx) {
            const value = node[idx]
            const valueSerialized = visitSerializableStructSync(value, {...ctx, path: [...ctx.path, idx]})

            list.push(valueSerialized)
        }

        return list
    }
    for (const codec of ctx.codecs) {
        const codecDidMatch = codec.is(node)

        if (! codecDidMatch) {
            continue
        }

        const valueEncoded = codec.encode(node, ctx)
        const valueEncodedDeep = visitSerializableStructSync(valueEncoded, ctx)

        ctx.stack.push([codec.id, ctx.path])

        return valueEncodedDeep
    }
    if (isObject(node)) {
        const object: Record<string, unknown> = {...node}

        for (const [key, value] of Object.entries(node)) {
            // Symbol keys are not supported because not serializable.
            const valueSerialized = visitSerializableStructSync(value, {...ctx, path: [...ctx.path, key]})

            object[key] = valueSerialized
        }

        return object
    }
    return node
}

export function deserializeStructSync(
    payloadSerialized: string,
    codecsOptional?: undefined | Array<SerialSyncCodec>,
): unknown {
    const codecs: Array<SerialSyncCodec> = codecsOptional ?? SerialSyncBuiltinCodecsList

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
        const valueDecoded = codec.decode(valueEncoded)

        setObjectPath(data, path, valueDecoded)
    }

    return payload?.data
}

// Types ///////////////////////////////////////////////////////////////////////

export interface SerialSyncCodec<T = unknown, E = unknown> {
    id: SerialCodecId
    is(value: unknown): value is T
    encode(value: T, ctx: SerialSyncCodecContext): E
    decode(valueEncoded: E): T
}

export interface SerialSyncCodecContext {
    codecs: Array<SerialSyncCodec>
    path: ObjectPath
    stack: Array<SerialStackEntry>
}

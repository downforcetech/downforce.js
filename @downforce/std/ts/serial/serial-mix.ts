import {isArray} from '../array/array-is.js'
import {pipe} from '../fn/fn-pipe.js'
import {identity, returnTrue} from '../fn/fn-return.js'
import {isObject} from '../object/object-is.js'

export function serializeAsJson(payload: unknown): string {
    return JSON.stringify(payload)
}

export function deserializeFromJson(payloadSerialized: string): unknown {
    return JSON.parse(payloadSerialized)
}

export function walkData(
    input: unknown,
    args: {
        filterArrayItem?: undefined | ((value: unknown, idx: number) => boolean)
        filterObjectKeyValue?: undefined | ((key: string, value: unknown) => boolean)
        mapArray?: undefined | ((list: Array<unknown>) => Array<unknown>)
        mapArrayItem?: undefined | ((value: unknown, idx: number) => unknown)
        mapObject?: undefined | ((object: Record<string, unknown>) => Record<string, unknown>)
        mapObjectKey?: undefined | ((key: string, value: unknown) => string)
        mapObjectValue?: undefined | ((value: unknown, key: string) => unknown)
        mapValue?: undefined | ((value: unknown) => unknown)
    },
): unknown {
    const {
        filterArrayItem,
        filterObjectKeyValue: filterObjectKeyValueOptional,
        mapArray: mapArrayOptional,
        mapArrayItem: mapArrayItemOptional,
        mapObject: mapObjectOptional,
        mapObjectKey: mapObjectKeyOptional,
        mapObjectValue: mapObjectValueOptional,
        mapValue: mapValueOptional,
    } = args

    const filterObjectKeyValue = filterObjectKeyValueOptional ?? returnTrue
    const mapArray = mapArrayOptional ?? identity
    const mapArrayItem = mapArrayItemOptional ?? identity
    const mapObject = mapObjectOptional ?? identity
    const mapObjectKey = mapObjectKeyOptional ?? identity
    const mapObjectValue = mapObjectValueOptional ?? identity
    const mapValue = mapValueOptional ?? identity

    if (input && isArray(input)) {
        return pipe(
            input.map((it, idx) =>
                pipe(
                    mapArrayItem(it, idx),
                    it => walkData(it, args),
                )
            ),
            input => filterArrayItem ? input.filter(filterArrayItem) : input,
            mapArray,
        )
    }
    if (input && isObject(input)) {
        const object: Record<string, unknown> = {}

        for (const key in input) {
            type Key = keyof typeof input
            const value = input[key as Key]

            if (filterObjectKeyValue(key, value)) {
                object[mapObjectKey(key, value)] = walkData(
                    mapObjectValue(value, key),
                    args,
                )
            }
        }

        return mapObject(object)
    }
    return mapValue(input)
}

import {getOrInit} from '../store/store-mix.js'

export function getMapValue<K, V>(
    map: Map<K, undefined | null | V>,
    key: K,
    init: (key: K) => V,
): V
export function getMapValue<K extends WeakKey, V>(
    map: WeakMap<K, undefined | null | V>,
    key: K,
    init: (key: K) => V,
): V
export function getMapValue<K extends WeakKey, V>(
    map:
        | Map<K, undefined | null | V>
        | WeakMap<K, undefined | null | V>
    ,
    key: K,
    init: (key: K) => V,
): V {
    return getOrInit(map, key, {
        init(key) {
            return init(key)
        },
        get(key) {
            return map.get(key)
        },
        set(key, value) {
            map.set(key, value)
        },
    })
}

/**
* Map.set() returns Map. This API does the opposite, returns the value.
*/
export function setMapValue<K, V>(
    map: Map<K, V>,
    key: K,
    value: V,
): V
export function setMapValue<K extends WeakKey, V>(
    map: WeakMap<K, V>,
    key: K,
    value: V,
): V
export function setMapValue<K extends WeakKey, V>(
    map: Map<K, V> | WeakMap<K, V>,
    key: K,
    value: V,
): V {
    map.set(key, value)

    return value
}

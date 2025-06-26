export function getMapValue<K, V>(map: Map<K, undefined | V>, key: K, init: () => V): V
export function getMapValue<K extends WeakKey, V>(map: WeakMap<K, undefined | V>, key: K, init: () => V): V
export function getMapValue<K extends WeakKey, V>(map: Map<K, undefined | V> | WeakMap<K, undefined | V>, key: K, init: () => V) {
    function initMapValue(): V {
        const value: V = init()

        map.set(key, value)

        return value
    }

    return map.get(key) ?? initMapValue()
}

/**
* Map.set() returns Map. This API does the opposite, returns the value.
*/
export function setMapValue<K, V>(map: Map<K, V>, key: K, value: V): V
export function setMapValue<K extends WeakKey, V>(map: WeakMap<K, V>, key: K, value: V): V
export function setMapValue<K extends WeakKey, V>(map: Map<K, V> | WeakMap<K, V>, key: K, value: V) {
    map.set(key, value)

    return value
}

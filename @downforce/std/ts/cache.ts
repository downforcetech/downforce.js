import type {Io} from './fn/fn-type.js'
import {getMapValue} from './map/map-mix.js'

export function createCache<K, V>(): Cache<K, V> {
    const cacheMap = new Map<K, undefined | V>()

    function use(key: K, computeValue: Io<K, V>): V {
        return computeCacheValue(cacheMap, key, computeValue)
    }

    return {use, map: cacheMap}
}

export function computeCacheValue<K, V>(
    cacheMap: Map<K, undefined | V>,
    key: K,
    computeValue: Io<K, V>,
): V {
    return getMapValue(cacheMap, key, () => computeValue(key))
}

// Types ///////////////////////////////////////////////////////////////////////

export interface Cache<K, V> {
    use(key: K, computeValue: Io<K, V>): V
    map: Map<K, undefined | V>
}

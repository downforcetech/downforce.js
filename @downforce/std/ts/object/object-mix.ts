import type {Fn, Io} from '../fn.js'
import {isDefined} from '../optional.js'

export function isObjectEmpty(object: object): boolean {
    for (const it in object) {
        return false
    }
    return true
}

export function objectFromEntry<K extends PropertyKey, V>(
    key: K,
    value: undefined | V,
): object | {[key in K]: V}
{
    return isDefined(value)
        ? {[key]: value}
        : {}
}

/*
* Stores an item inside an object, returning the object. Useful when used inside
* an Array.reduce() function.
*
* EXAMPLE
* const index = indexBy({}, {key: 123}, it => it.key)
* [{id: 123}, {id: 234}].reduce((index, it) => indexBy(index, it, it => it.id), {})
*/
export function indexBy<
    M extends Record<PropertyKey, unknown>,
    K extends keyof M,
    T extends M[K],
>(
    map: M,
    item: T,
    keyOf: Io<T, K>,
): M {
    const key = keyOf(item)

    map[key] = item

    return map
}

export function indexingBy<
    M extends Record<PropertyKey, unknown>,
    K extends keyof M,
    T extends M[K],
>(
    keyOf: Io<T, K>,
): Fn<[map: M, item: T], M> {
    function indexItem(map: M, item: T) {
        return indexBy(map, item, keyOf)
    }

    return indexItem
}

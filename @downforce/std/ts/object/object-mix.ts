import type {Fn, Io} from '../fn.js'
import {isDefined, isUndefined} from '../optional.js'
import type {ObjectComplete, Prettify} from '../type.js'

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


export function mapObject<K extends PropertyKey, V, RK extends PropertyKey, RV>(
    object: Record<K, V>,
    mapKey: ObjectKeyMapper<K, V, RK>,
    mapValue: ObjectValueMapper<V, K, RV>,
): Record<RK, RV> {
    function mapEntry(it: [K, V]): [RK, RV] {
        const [key, value] = it
        return [mapKey(key, value), mapValue(value, key)]
    }

    const entries = Object.entries(object) as Array<[K, V]>
    const outputObject = Object.fromEntries(entries.map(mapEntry))

    return outputObject as unknown as Record<RK, RV>
}

export function mapObjectEntry<K extends PropertyKey, V, RK extends PropertyKey, RV>(
    object: Record<K, V>,
    fn: ObjectEntryMapper<K, V, RK, RV>,
): Record<RK, RV> {

    function mapEntry(it: [K, V]): [RK, RV] {
        const [key, value] = it
        return fn(key, value)
    }

    const entries = Object.entries(object) as Array<[K, V]>
    const outputObject = Object.fromEntries(entries.map(mapEntry))

    return outputObject as unknown as Record<RK, RV>
}

export function mapObjectKey<K extends PropertyKey, V, RK extends PropertyKey>(
    object: Record<K, V>,
    fn: ObjectKeyMapper<K, V, RK>,
): Record<RK, V> {
    function mapKey(it: [K, V]): [RK, V] {
        const [key, value] = it
        return [fn(key, value), value]
    }

    const entries = Object.entries(object) as Array<[K, V]>
    const outputObject = Object.fromEntries(entries.map(mapKey))

    return outputObject as unknown as Record<RK, V>
}

export function mapObjectValue<K extends PropertyKey, V, RV>(
    object: Record<K, V>,
    fn: ObjectValueMapper<V, K, RV>,
): Record<K, RV> {
    function mapValue(it: [K, V]): [K, RV] {
        const [key, value] = it
        return [key, fn(value, key)]
    }

    const entries = Object.entries(object) as Array<[K, V]>
    const outputObject = Object.fromEntries(entries.map(mapValue))

    return outputObject as unknown as Record<K, RV>
}


export function pickObjectProp<O extends object, P extends keyof O>(object: O, prop: P): Pick<O, P> {
    return {[prop]: object[prop]} as Pick<O, P>
}

export function pickObjectProps<O extends object, P extends keyof O>(object: O, ...props: Array<P>): Pick<O, P> {
    const objectPicked = {} as Record<P, O[P]>

    for (const prop of props) {
        objectPicked[prop] = object[prop]
    }

    return objectPicked as Pick<O, P>
}

export function omitObjectProp<O extends object, P extends keyof O>(object: O, prop: P): Omit<O, P> {
    const {[prop]: omittedProp, ...otherProps} = object
    return otherProps
}

export function omitObjectProps<O extends object, P extends keyof O>(object: O, ...props: Array<P>): Omit<O, P> {
    const objectOmitted = {...object}

    for (const prop of props) {
        delete objectOmitted[prop]
    }

    return objectOmitted as Omit<O, P>
}

export function omitObjectPropsUndefined<O extends object>(object: O): Prettify<Partial<ObjectComplete<O>>> {
    const objectOmitted = {...object}

    for (const prop in objectOmitted) {
        if (isUndefined(objectOmitted[prop])) {
            delete objectOmitted[prop]
        }
    }

    return objectOmitted as Prettify<Partial<ObjectComplete<O>>>
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

export function indexedBy<
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

// Types ///////////////////////////////////////////////////////////////////////

export type ObjectEntryMapper<K, V, RK, RV> = (key: K, value: V) => [RK, RV]
export type ObjectKeyMapper<K, V, R> = (key: K, value: V) => R
export type ObjectValueMapper<V, K, R> = (value: V, key: K) => R

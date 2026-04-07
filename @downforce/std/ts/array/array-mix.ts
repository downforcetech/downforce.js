import {PartialApplication} from '../fn/fn-partial.js'
import type {Io} from '../fn/fn-type.js'
import {getMapValue} from '../map/map-mix.js'
import {isSome} from '../optional/optional-is.js'
import type {Some} from '../optional/optional-type.js'
import {isArray} from './array-is.js'

// export function arrayWrap<V, I>(value: V | readonly I[]): [V] | readonly I[]
// export function arrayWrap<V, I>(value: V | I[]): V[] | I[]
export function arrayWrap<V, A extends unknown[]>(value: V | [...A]): [V] | [...A]
export function arrayWrap<V, A extends unknown[]>(value: V | readonly [...A]): [V] | readonly [...A]
export function arrayWrap<V, I>(value: V | Array<I>): [V] | Array<I>
export function arrayWrap<V>(value: V | Array<V>): Array<V>
export function arrayWrap<V>(value: V | Array<V>): Array<V> {
    if (isArray(value)) {
        return value
    }
    return [value]
}

export function firstOf<I>(input: Array<I>): undefined | I {
    return input[0]
}

export function lastOf<I>(input: Array<I>): undefined | I {
    return input[input.length - 1]
    // return list.at(-1)
}

export function filterSome<I>(input: Array<I>): Array<Some<I>> {
    return input.filter(isSome)
}

export function mapArray<I, R>(
    input: PartialApplication.Placeholder,
    mapItem: (it: NoInfer<I>, idx: number) => R,
): Io<Array<I>, Array<R>>
export function mapArray<I, R>(
    input: Array<I>,
    mapItem: (it: I, idx: number) => R,
): Array<R>
export function mapArray<I, R>(
    input: Array<I> | PartialApplication.Placeholder,
    mapItem: (it: I, idx: number) => R,
): Array<R> | Io<Array<I>, Array<R>> {
    if (input === PartialApplication.Placeholder) {
        return (input: Array<I>) => mapArray(input, mapItem)
    }

    return input.map(mapItem)
}

export function _mapArray<I, R>(
    mapItem: (it: NoInfer<I>, idx: number) => R,
): Io<Array<I>, Array<R>> {
    return (input: Array<I>) => mapArray(input, mapItem)
}

export function splitArray<I>(
    input: PartialApplication.Placeholder,
    onFilter: (item: I, idx: number) => boolean,
): Io<Array<I>, [Array<I>, Array<I>]>
export function splitArray<I>(
    input: Array<I>,
    onFilter: (item: I, idx: number) => boolean,
): [Array<I>, Array<I>]
export function splitArray<I>(
    input: Array<I> | PartialApplication.Placeholder,
    onFilter: (item: I, idx: number) => boolean,
): [Array<I>, Array<I>] | Io<Array<I>, [Array<I>, Array<I>]> {
    if (input === PartialApplication.Placeholder) {
        return (input: Array<I>) => splitArray(input, onFilter)
    }

    const trueList: Array<I> = []
    const falseList: Array<I> = []

    input.forEach((it, idx) => {
        const result = onFilter(it, idx)

        if (result) {
            trueList.push(it)
        }
        else {
            falseList.push(it)
        }
    })

    return [trueList, falseList]
}

export function _splitArray<I, R>(
    onFilter: (item: I, idx: number) => boolean,
): Io<Array<I>, [Array<I>, Array<I>]> {
    return (input: Array<I>) => splitArray(input, onFilter)
}

export function chunkArray<I>(input: Array<I>, chunkSize: number): Array<Array<I>> {
    const listSize = input.length
    const chunks: Array<Array<I>> = []

    for (let idx = 0; idx < listSize; idx += chunkSize) {
        const chunk = input.slice(idx, idx + chunkSize)

        chunks.push(chunk)
    }

    return chunks
}

export function uniq<I>(input: Array<I>): Array<I> {
    return Array.from(new Set(input))
}

export function groupBy<I, K extends PropertyKey>(
    input: Array<I>,
    keyOf: Io<I, K>,
): Record<K, Array<I>> {
    const groups = {} as Record<K, Array<I>>

    for (const it of input) {
        const key = keyOf(it)
        groups[key] ??= []
        groups[key]?.push(it)
    }

    return groups
}

export function groupMapBy<I, K>(
    input: Array<I>,
    keyOf: Io<I, K>,
): Map<K, Array<I>> {
    const groupsMap = new Map<K, Array<I>>()

    for (const it of input) {
        const key = keyOf(it)
        const group = getMapValue(groupsMap, key, () => [])
        group?.push(it)
    }

    return groupsMap
}

export function intersectBy<I, K>(keyOf: Io<I, K>, ...lists: Array<Array<I>>): Array<I> {
    const intersectionList: Array<I> = []
    const uniqueItemsMap = new Map(lists.flat().map(it => [keyOf(it), it]))

    for (const [itemKey, item] of uniqueItemsMap.entries()) {
        const itemKeyIsInEveryList = lists.every(list =>
            list.some(it => keyOf(it) === itemKey)
        )
        if (! itemKeyIsInEveryList) {
            continue
        }
        intersectionList.push(item)
    }

    return intersectionList
}

export function moveArrayItem<I>(input: Array<I>, from: number, to: number): Array<I> {
    const listClone = Array.from(input)
    moveArrayItemInplace(listClone, from, to)
    return listClone
}

export function moveArrayItemInplace<I>(input: Array<I>, from: number, to: number): undefined {
    if (from < 0) {
        return
    }
    if (from >= input.length) {
        return
    }

    const item = input[from]
    input.splice(from, 1)
    input.splice(to, 0, item!)
}

export function asMatrix<I>(input: Array<I>, size: number): Array<Array<I>> {
    return input.reduce((rows, key, index) => {
        if ((index % size) === 0) {
            rows.push([key])
        }
        else {
            rows[rows.length - 1]?.push(key)
        }
        return rows
    }, [] as Array<Array<I>>)
}

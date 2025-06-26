import {mapArray} from './array-mix.js'

export function mappingArray<I, R>(mapItem: (it: I, idx: number) => R): (list: Array<I>) => Array<R> {
    return (list: Array<I>): Array<R> => mapArray(list, mapItem)
}

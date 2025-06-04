import {mapArray} from './array-map.js'

export function mapArrayTo<I, R>(mapItem: (it: NoInfer<I>, idx: number) => R): (list: Array<I>) => Array<R> {
    return (list: Array<I>): Array<R> => mapArray(list, mapItem)
}

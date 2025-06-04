export function mapArray<I, R>(list: Array<I>, mapItem: (it: I, idx: number) => R): Array<R> {
    return list.map(mapItem)
}

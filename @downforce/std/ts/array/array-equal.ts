export function areArraysEqual(first: Array<unknown>, second: Array<unknown>): boolean {
    if (first.length !== second.length) {
        return false
    }

    return first.every((_, idx) => first[idx] === second[idx])
}

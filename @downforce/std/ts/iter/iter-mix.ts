import {isDefined} from '../optional/optional-is.js'

export function times(count: number): Array<number> {
    return Array(count).fill(undefined).map((nil, idx) => idx)
}

/*
* Creates an iterator.
*
* EXAMPLE
*
* for (const it of sequence()) {
* }
*/
export function sequence(options?: undefined | {
    from?: undefined | number
    to?: undefined | number
    increment?: undefined | number
}): Generator<number, void, void>
export function sequence(options?: undefined | {
    from?: undefined | number
    times?: undefined | number
    increment?: undefined | number
}): Generator<number, void, void>
export function* sequence(options?: undefined | {
    from?: undefined | number
    to?: undefined | number
    times?: undefined | number
    increment?: undefined | number
}): Generator<number, void, void> {
    const from = options?.from ?? 0
    const to = options?.to
    const times = options?.times
    const increment = options?.increment ?? 1

    let current = from

    // Range iteration (from a to b).
    if (isDefined(to)) {
        const direction = from <= to ? 1 : -1
        const directionalIncrement = direction * Math.abs(increment)

        while (
            from <= to
                ? (to - current) >= 0
                : (to - current) <= 0
        ) {
            yield current
            current += directionalIncrement
        }
    }
    // Count iteration (times).
    else if (isDefined(times)) {
        let iterations = 0
        while (iterations < times) {
            yield current
            current += increment
            iterations += 1
        }
    }
    // Infinite iteration.
    else {
        while (true) {
            yield current
            current += increment
        }
    }
}

/*
* Creates an iterator.
*
* EXAMPLE
*
* for (const it of range(10, 20)) {
* }
*/
export function range(from: number, to: number, increment?: undefined | number): Generator<number, void, void> {
    return sequence({from: from, to: to, increment: increment})
}

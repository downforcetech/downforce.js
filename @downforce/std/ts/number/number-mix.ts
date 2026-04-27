import type {Io} from '../fn/fn-type.js'
import {isUndefined} from '../optional/optional-is.js'

// We don't define isInteger as a type predicate, because it would lead to an incorrect control flow.
// export function isInteger(value: unknown): value is number
export function isInteger(value: number): boolean {
    return Number.isInteger(value)
    // return isNumber(value) && value % 1 === 0
}

export function isBetween(from: number, value: number, to: number): boolean {
    return (
        (from <= value && value <= to)
        || (to <= value && value <= from)
    )
}

export function clamp(from: number, value: number, to: number): number {
    const min = Math.min(from, to)
    const max = Math.max(from, to)

    return Math.max(min, Math.min(max, value))
}

export function round(value: number, round: number): number {
    return Math.trunc(value / round) * round
}

export function roundUp(value: number, round: number): number {
    return Math.ceil(value / round) * round
}

export function roundDown(value: number, round: number): number {
    return Math.floor(value / round) * round
}

export function sum(items: Array<number>, getter?: undefined): number;
export function sum<I>(items: Array<I>, getter: Io<I, number>): number;
export function sum<I>(items: Array<number> | Array<I>, getter?: undefined | Io<I, number>): number {
    const total = (items as Array<I>).reduce((sum: number, it) => {
        const value = getter ? getter(it) : it as number
        return sum + value
    }, 0)

    return total
}

export function average(items: Array<number>, getter?: undefined): number;
export function average<I>(items: Array<I>, getter: Io<I, number>): number;
export function average<I>(items: Array<number> | Array<I>, getter?: undefined | Io<I, number>): number {
    const total = sum(items as Array<I>, getter as Io<I, number>)

    return total / items.length
}

export function minMax(items: Array<number>, getter?: undefined): MinMaxMaybe;
export function minMax<I>(items: Array<I>, getter: Io<I, number>): MinMaxMaybe;
export function minMax<I>(items: Array<number> | Array<I>, getter?: undefined | Io<I, number>): MinMaxMaybe {
    let min: undefined | number = undefined
    let max: undefined | number = undefined

    for (const it of items) {
        const value = getter ? getter(it as I) : it as number
        min = Math.min(value, min ?? value)
        max = Math.max(value, max ?? value)
    }

    if (isUndefined(min) || isUndefined(max)) {
        return [undefined, undefined]
    }

    return [min, max]
}

export function minMaxOrZero(items: Array<number>, getter?: undefined): MinMax;
export function minMaxOrZero<I>(items: Array<I>, getter: Io<I, number>): MinMax;
export function minMaxOrZero<I>(items: Array<number> | Array<I>, getter?: undefined | Io<I, number>): MinMax {
    const [min, max] = minMax(items as Array<I>, getter as Io<I, number>)
    return [min ?? 0, max ?? 0]
}

// Types ///////////////////////////////////////////////////////////////////////

export type MinMaxMaybe = [undefined, undefined] | MinMax
export type MinMax = [number, number]

import {isDefined, isUndefined} from '../optional/optional-is.js'
import type {None} from '../optional/optional-type.js'
import {strictIntegerLike, strictNumberLike} from './number-strict.js'

export function asNumber(value: None | number | string): undefined | number {
    return strictNumberLike(value)
}

export function asInteger(value: None | number | string): undefined | number {
    return strictIntegerLike(value)
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

    return Math.min(max, Math.max(min, value))
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
export function sum<I>(items: Array<I>, getter: NumberGetter<I>): number;
export function sum<I>(items: Array<number> | Array<I>, getter?: undefined | NumberGetter<I>): number {
    const total = (items as Array<I>).reduce((sum: number, it) =>
        sum + readItemNumber(it, getter as NumberGetter<I>)
    , 0)

    return total
}

export function average(items: Array<number>, getter?: undefined): number;
export function average<I>(items: Array<I>, getter: NumberGetter<I>): number;
export function average<I>(items: Array<number> | Array<I>, getter?: undefined | NumberGetter<I>): number {
    const total = sum(items as Array<I>, getter as NumberGetter<I>)

    return total / items.length
}

export function minMax(items: Array<number>, getter?: undefined): MinMaxMaybe;
export function minMax<I>(items: Array<I>, getter: NumberGetter<I>): MinMaxMaybe;
export function minMax<I>(items: Array<number> | Array<I>, getter?: undefined | NumberGetter<I>): MinMaxMaybe {
    let min: undefined | number = undefined
    let max: undefined | number = undefined

    for (const it of items) {
        const value = readItemNumber(it as I, getter as NumberGetter<I>)
        min = Math.min(value, min ?? value)
        max = Math.max(value, max ?? value)
    }

    if (isUndefined(min) || isUndefined(max)) {
        return [undefined, undefined]
    }

    return [min, max]
}

export function minMaxOrZero(items: Array<number>, getter?: undefined): MinMax;
export function minMaxOrZero<I>(items: Array<I>, getter: NumberGetter<I>): MinMax;
export function minMaxOrZero<I>(items: Array<number> | Array<I>, getter?: undefined | NumberGetter<I>): MinMax {
    const [min, max] = minMax(items as Array<I>, getter as NumberGetter<I>)
    return [min ?? 0, max ?? 0]
}

export function readItemNumber(it: number, getter?: undefined): number
export function readItemNumber<I>(it: I, getter: NumberGetter<I>): number
export function readItemNumber<I>(it: number | I, getter?: undefined | NumberGetter<I>): number {
    return isDefined(getter)
        ? getter(it as I)
        : it as number
}

// Types ///////////////////////////////////////////////////////////////////////

export type MinMaxMaybe = [undefined, undefined] | MinMax
export type MinMax = [number, number]
export type NumberGetter<I> = (it: I) => number

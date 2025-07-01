import {isBetween} from '../number/number-mix.js'
import {isDefined} from '../optional/optional-is.js'
import type {None} from '../optional/optional-type.js'
import {isString} from '../string/string-is.js'
import {strictDate} from './date-strict.js'
import type {DateNumber} from './date-type.js'

export const OneSecondInMs: number = 1_000
export const OneMinuteInMs: number = 60 * OneSecondInMs
export const OneHourInMs: number = 60 * OneMinuteInMs
export const OneDayInMs: number = 24 * OneHourInMs
export const OneWeekInMs: number = 7 * OneDayInMs
export const OneMonthInMs: number = 30 * OneDayInMs
export const OneYearInMs: number = 365 * OneDayInMs

export function asDate(value: number | Date): Date
export function asDate(value: None | string | number | Date): undefined | Date
export function asDate(value: None | string | number | Date) {
    return strictDate(value)
}

export function dateNow(): Date {
    return new Date()
}

export function isDateString(value: unknown): value is string {
    if (! value || ! isString(value) || ! Boolean(Date.parse(value))) {
        return false
    }
    return true
}

export function isDateStringIsoUtc(value: string): boolean {
    if (! isString(value)) {
        return false
    }
    if (! isDateString(value)) {
        return false
    }

    const isoMarker = 't'
    const utcZone = 'z'
    const valueLowerCase = value.toLowerCase()
    const includesIsoMarker = valueLowerCase.includes(isoMarker)
    const includesUtcZone = includesIsoMarker && valueLowerCase.includes(utcZone)
    const isIsoUtcString = includesUtcZone

    return isIsoUtcString
}

export function isDateBetween(from: undefined | Date, date: Date, to: undefined | Date): boolean {
    return isTimeBetween(from?.getTime(), date.getTime(), to?.getTime())
}

export function isTimeBetween(from: undefined | DateNumber, date: DateNumber, to: undefined | DateNumber): boolean {
    const fromDefined = isDefined(from)
    const toDefined = isDefined(to)

    if (! fromDefined && ! toDefined) {
        return true
    }
    if (fromDefined && toDefined) {
        return isBetween(from, date, to)
    }
    if (fromDefined) {
        return date >= from
    }
    if (toDefined) {
        return date <= to
    }
    return false
}

export function dateYearOf(date: Date): number {
    return date.getFullYear()
}

export function dateMonthOf(date: Date): number {
    return date.getMonth() + 1
}

export function dateDayOf(date: Date): number {
    return date.getDate()
}

export function dateHourOf(date: Date): number {
    return date.getHours()
}

export function dateMinuteOf(date: Date): number {
    return date.getMinutes()
}

export function dateSecondOf(date: Date): number {
    return date.getSeconds()
}

export function dateMillisecondOf(date: Date): number {
    return date.getMilliseconds()
}

export function roundTimeToSeconds(time: DateNumber): number {
    return Math.trunc(time / 1_000) * 1_000
}

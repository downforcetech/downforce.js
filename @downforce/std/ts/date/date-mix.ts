import {formatEnsureInvalidTypeMessage} from '../ensure.js'
import {throwInvalidType} from '../error.js'
import {isBetween, isNumber} from '../number.js'
import {isDefined} from '../optional.js'
import {isString} from '../string.js'
import {isDate} from './date-is.js'
import type {DateNumber} from './date-type.js'

export const OneSecondInMs: number = 1_000
export const OneMinuteInMs: number = 60 * OneSecondInMs
export const OneHourInMs: number = 60 * OneMinuteInMs
export const OneDayInMs: number = 24 * OneHourInMs
export const OneWeekInMs: number = 7 * OneDayInMs
export const OneMonthInMs: number = 30 * OneDayInMs
export const OneYearInMs: number = 365 * OneDayInMs

export function asDate(value: number | Date): Date {
    if (isNumber(value)) {
        return new Date(value)
    }
    if (isDate(value)) {
        return value
    }
    return throwInvalidType(formatEnsureInvalidTypeMessage('a number | Date', value))
}

export function dateNow(): Date {
    return new Date()
}

export function isDateStringIsoUtc(value: unknown): value is string {
    if (! isString(value)) {
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
        return from <= date
    }
    if (toDefined) {
        return to >= date
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

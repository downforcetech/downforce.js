import {isUndefined} from '../optional/optional-is.js'
import {asDate, dateDayOf, dateHourOf, dateMillisecondOf, dateMinuteOf, dateMonthOf, dateNow, dateSecondOf, dateYearOf} from './date-mix.js'

export const DateTime: {
    new: typeof createDateTime
    now: typeof dateTimeNow
    fromDate: typeof dateTimeWrap
    toDate: typeof dateTimeUnwrap
} = {
    new: createDateTime,
    now: dateTimeNow,
    fromDate: dateTimeWrap,
    toDate: dateTimeUnwrap,
}

export function createDateTime(args: {
    year: number
    month: number
    day: number
    hour: number
    minute: number
    second: number
    millisecond: number
}): Readonly<DateTimeMixed> {
    const datetime: Readonly<DateTimeMixed> = Object.freeze({
        year: args.year,
        month: args.month,
        day: args.day,
        hour: args.hour,
        minute: args.minute,
        second: args.second,
        millisecond: args.millisecond,
        [0]: args.year,
        [1]: args.month,
        [2]: args.day,
        [3]: args.hour,
        [4]: args.minute,
        [5]: args.second,
        [6]: args.millisecond,

        [Symbol.iterator](): Iterator<number, void, void> {
            let idx: 0 | 1 | 2 | 3 | 4 | 5 | 6 = 0

            return {
                next() {
                    const value = datetime[idx]

                    idx += 1

                    if (isUndefined(value)) {
                        return {done: true, value: void undefined}
                    }
                    return {done: false, value}
                },
                return() {
                    return {done: true, value: void undefined}
                },
            }
        },
    } satisfies DateTimeMixed)

    return datetime
}

export function dateTimeNow(): DateTimeMixed {
    return dateTimeWrap(dateNow())
}

export function dateTimeWrap(dateOrNumber: Date | number): Readonly<DateTimeMixed> {
    const date = asDate(dateOrNumber)

    return createDateTime({
        year: dateYearOf(date),
        month: dateMonthOf(date),
        day: dateDayOf(date),
        hour: dateHourOf(date),
        minute: dateMinuteOf(date),
        second: dateSecondOf(date),
        millisecond: dateMillisecondOf(date),
    })
}

export function dateTimeUnwrap(datetime: DateTimeMixed): Date {
    return new Date(
        datetime[0], // Year.
        datetime[1], // Month.
        datetime[2], // Day.
        datetime[3] - 1, // Hour (Date month starts from 0).
        datetime[4], // Minute.
        datetime[5], // Second.
        datetime[6], // Millisecond.
    )
}

// Types ///////////////////////////////////////////////////////////////////////

export interface DateTimeMixed extends DateTimeList, DateTimeDict, Iterable<number, void, void> {
}

export interface DateTimeList {
    [0]: number // Year.
    [1]: number // Month.
    [2]: number // Day.
    [3]: number // Hour.
    [4]: number // Minute.
    [5]: number // Second.
    [6]: number // Millisecond.
}

export interface DateTimeDict {
    year: number
    month: number
    day: number
    hour: number
    minute: number
    second: number
    millisecond: number
}

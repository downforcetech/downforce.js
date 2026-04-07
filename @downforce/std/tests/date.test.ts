import {matchDate} from '@downforce/std/date'
import {expectType} from '@downforce/std/type'
import {describe, test} from 'node:test'

describe('@downforce/std/date', (ctx) => {
    test('matchDate()', (ctx) => {
        {
            const input = undefined as unknown

            matchDate(input, expectType<Date>)
            expectType<Date | 123>(matchDate(input, expectType<Date>, unknown => 123))
        }
        {
            const input = undefined as Date | undefined | null | string | {name: string} | Array<number>

            matchDate(input, expectType<Date>)
            matchDate(input, expectType<Date>, expectType<undefined | null | string | {name: string} | Array<number>>)
        }
    })
})

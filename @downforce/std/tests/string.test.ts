import {matchString} from '@downforce/std/string'
import {expectType} from '@downforce/std/type'
import {describe, test} from 'node:test'

describe('@downforce/std/string', (ctx) => {
    test('matchString()', (ctx) => {
        {
            const input = undefined as unknown

            matchString(input, expectType<string>)
            expectType<string | 123>(matchString(input, expectType<string>, unknown => 123))
        }
        {
            const input = undefined as 'A' | 'B' | undefined | null | number | Array<string>

            matchString(input, expectType<'A' | 'B'>)
            matchString(input, expectType<'A' | 'B'>, expectType<undefined | null | number | Array<string>>)
        }
    })
})

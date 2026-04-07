import {matchPromise} from '@downforce/std/promise'
import {expectType} from '@downforce/std/type'
import {describe, test} from 'node:test'

describe('@downforce/std/promise', (ctx) => {
    test('matchPromise()', (ctx) => {
        {
            const input = undefined as unknown

            matchPromise(input, expectType<Promise<unknown>>)
            expectType<Promise<unknown> | 123>(matchPromise(input, expectType<Promise<unknown>>, unknown => 123))
        }
        {
            const input = undefined as Promise<boolean> | undefined | null | 'A' | number | Array<string>

            matchPromise(input, expectType<Promise<boolean>>)
            matchPromise(input, expectType<Promise<boolean>>, expectType<undefined | null | 'A' | number | Array<string>>)
        }
    })
})

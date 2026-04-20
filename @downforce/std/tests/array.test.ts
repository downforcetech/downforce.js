import {areArraysEqual, arrayWrap, filterSome, matchArray} from '@downforce/std/array'
import {expectType} from '@downforce/std/type'
import {describe, test} from 'node:test'
import Assert from 'node:assert/strict'

describe('@downforce/std/array', (ctx) => {
    test('areArraysEqual()', (ctx) => {
        {
            const actual = areArraysEqual(
                [undefined, null, true, NaN, 123, 'abc'],
                [undefined, null, true, NaN, 123, 'abc'],
            )

            Assert.equal(actual, true)
        }
        {
            const actual = areArraysEqual(
                [undefined, null, true, NaN, 123, 'abc'],
                [undefined, null, true, NaN, 123, 'abc', new Date()],
            )

            Assert.equal(actual, false)
        }
    })

    test('matchArray()', (ctx) => {
        {
            const input = undefined as unknown

            matchArray(input, expectType<Array<unknown>>)
            expectType<Array<unknown> | 123>(matchArray(input, expectType<Array<unknown>>, unknown => 123))
        }
        {
            const input = undefined as Array<string> | undefined | null | 'A' | number | {name: string}

            matchArray(input, expectType<Array<string>>)
            matchArray(input, expectType<Array<string>>, expectType<undefined | null | 'A' | number | {name: string}>)
        }
    })

    test('arrayWrap()', (ctx) => {
        expectType<[number]>(arrayWrap([] as unknown as (number | [number])))
        expectType<number[]>(arrayWrap([] as unknown as (number | number[])))
        expectType<Array<number>>(arrayWrap([] as unknown as (number | Array<number>)))
        expectType<readonly [number]>(arrayWrap([] as unknown as (number | readonly [number])))
        expectType<readonly number[]>(arrayWrap([] as unknown as (number | readonly number[])))
        expectType<ReadonlyArray<number>>(arrayWrap([] as unknown as (number | ReadonlyArray<number>)))
        expectType<[number] | [number, string]>(arrayWrap([] as unknown as (number | [number, string])))
        expectType<Array<number> | Array<number|string>>(arrayWrap([] as unknown as (number | Array<number|string>)))
        expectType<[number, ...Array<unknown>]>(arrayWrap([] as unknown as (number | [number, string])))
    })

    test('filterSome()', (ctx) => {
        {
            const input = filterSome([undefined, null, true, 123, 'abc'])

            expectType<Array<boolean | number | string>>(input)
        }
    })
})

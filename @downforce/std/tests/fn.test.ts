import {chain, compose, composed, identity, matchFunction, Pipe, pipe, piped} from '@downforce/std/fn'
import {expectType} from '@downforce/std/type'
import Assert from 'node:assert/strict'
import {describe, test} from 'node:test'

type Data = {id: number, name: string, age: number, admin: boolean, value: number}
const data: Data = {id: 1, name: 'Mario', age: 18, admin: false, value: 123}

describe('@downforce/std/fn', (ctx) => {
    test('matchFunction()', (ctx) => {
        {
            const input = undefined as unknown

            matchFunction(input, expectType<Function>)
            expectType<Function | 123>(matchFunction(input, expectType<Function>, unknown => 123))
        }
        {
            const input = undefined as ((arg: string) => 123) | undefined | null | 'A' | number | {name: string}

            matchFunction(input, expectType<(arg: string) => 123>)
            matchFunction(input, expectType<(arg: string) => 123>, expectType<undefined | null | 'A' | number | {name: string}>)
        }
    })

    test('pipe()', async (ctx) => {
        {
            const actual: Data = pipe(data)

            Assert.deepEqual(actual, data)
        }

        {
            const actual = pipe(
                0 as const,
                it => it + 1 as 1,
                it => it + 1 as 2,
                it => it + 1 as 3,
                it => it + 1 as 4,
                it => it + 1 as 5,
                it => it + 1 as 6,
                it => it + 1 as 7,
                it => it + 1 as 8,
                it => it + 1 as 9,
                it => it + 1 as 10,
                it => it + 1 as 11,
                it => it + 1 as 12,
                it => it + 1 as 13,
                it => it + 1 as 14,
                it => it + 1 as 15,
                it => it + 1 as 16,
                it => it + 1 as 17,
                it => it + 1 as 18,
                it => it + 1 as 19,
                it => it + 1 as 20,
            )

            expectType<20>(actual)
            Assert.equal(actual, 20)
        }

        {
            const actual: string = pipe(
                data,
                it => it.value,
                String,
            )

            Assert.equal(actual, '123')
        }
    })

    test('piped()', async (ctx) => {
        {
            const actual: Data = piped(data)()

            Assert.equal(actual, data)
        }

        {
            const actual: string = piped(data)
                (it => it.value)
                (String)
                (identity)
            ()

            Assert.equal(actual, '123')
        }
    })

    test('Pipe()', (ctx) => {
        {
            const actual: string = Pipe(data)
                .to(it => it.value)
                .to(String)
                .to(identity)
            .end

            Assert.equal(actual, '123')
        }
    })

    test('chain()', (ctx) => {
        {
            const actual: Data = chain(
                data,
                it => it.id,
                it => it.name,
            )

            Assert.equal(actual, data)
        }
    })

    test('compose()', (ctx) => {
        const fn = compose(
            (it: Data) => it.value,
            String,
            identity,
        )
        const actual: string = fn(data)

        Assert.equal(actual, '123')
    })

    test('composed()', (ctx) => {
        const fn = composed
            ((it: Data) => it.value)
            (it => String(it))
            (identity)
        ()

        const actual: string = fn(data)

        Assert.equal(actual, '123')
    })
})

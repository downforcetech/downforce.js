import {range, sequence} from '@downforce/std/iter'
import Assert from 'node:assert'
import {describe, test} from 'node:test'

describe('@downforce/std/iter', (ctx) => {
    test('iterate()', (ctx) => {
        {
            const actual: Array<number> = []
            const expected: Array<number> = [0, 1, 2]

            for (const it of sequence({times: 3})) {
                actual.push(it)

                Assert(actual.length <= expected.length)
            }

            Assert.deepStrictEqual(actual, expected)
        }
        {
            const actual: Array<number> = []
            const expected: Array<number> = [10, 12, 14]

            for (const it of sequence({from: 10, times: 3, increment: 2})) {
                actual.push(it)

                Assert(actual.length <= expected.length)
            }

            Assert.deepStrictEqual(actual, expected)
        }
        {
            const actual: Array<number> = []
            const expected: Array<number> = [10, 8, 6]

            for (const it of sequence({from: 10, times: 3, increment: -2})) {
                actual.push(it)

                Assert(actual.length <= expected.length)
            }

            Assert.deepStrictEqual(actual, expected)
        }
        {
            const actual: Array<number> = []
            const expected: Array<number> = [0, 1, 2, 3]

            for (const it of sequence({to: 3})) {
                actual.push(it)

                Assert(actual.length <= expected.length)
            }

            Assert.deepStrictEqual(actual, expected)
        }
        {
            const actual: Array<number> = []
            const expected: Array<number> = [10, 12, 14]

            for (const it of sequence({from: 10, to: 14, increment: 2})) {
                actual.push(it)

                Assert(actual.length <= expected.length)
            }

            Assert.deepStrictEqual(actual, expected)
        }
        {
            const actual: Array<number> = []
            const expected: Array<number> = [10, 12, 14]

            for (const it of sequence({from: 10, to: 14, increment: -2})) {
                actual.push(it)

                Assert(actual.length <= expected.length)
            }

            Assert.deepStrictEqual(actual, expected)
        }
        {
            const actual: Array<number> = []
            const expected: Array<number> = [14, 12, 10]

            for (const it of sequence({from: 14, to: 10, increment: 2})) {
                actual.push(it)

                Assert(actual.length <= expected.length)
            }

            Assert.deepStrictEqual(actual, expected)
        }
    })

    test('range()', (ctx) => {
        {
            const actual: Array<number> = []
            const expected: Array<number> = [0, 1, 2, 3]

            for (const it of range(0, 3)) {
                actual.push(it)

                Assert(actual.length <= expected.length)
            }

            Assert.deepStrictEqual(actual, expected)
        }
        {
            const actual: Array<number> = []
            const expected: Array<number> = [0, 1, 2, 3]

            for (const it of range(0, 3, -1)) {
                actual.push(it)

                Assert(actual.length <= expected.length)
            }

            Assert.deepStrictEqual(actual, expected)
        }
        {
            const actual: Array<number> = []
            const expected: Array<number> = [10, 12, 14, 16]

            for (const it of range(10, 16, 2)) {
                actual.push(it)

                Assert(actual.length <= expected.length)
            }

            Assert.deepStrictEqual(actual, expected)
        }
        {
            const actual: Array<number> = []
            const expected: Array<number> = [10, 12, 14, 16]

            for (const it of range(10, 16, -2)) {
                actual.push(it)

                Assert(actual.length <= expected.length)
            }

            Assert.deepStrictEqual(actual, expected)
        }
        {
            const actual: Array<number> = []
            const expected: Array<number> = [16, 14, 12, 10]

            for (const it of range(16, 10, 2)) {
                actual.push(it)

                Assert(actual.length <= expected.length)
            }

            Assert.deepStrictEqual(actual, expected)
        }
    })
})

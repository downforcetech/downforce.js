import {Enum, Union, type UnionOf} from '@downforce/std/enum'
import {expectType, type EqualTypes, type AssertType} from '@downforce/std/type'
import Assert from 'node:assert/strict'
import {describe, test} from 'node:test'

const ActualEnum = Enum({
    A: 'A',
    B: 'B',
    C: 1,
    D: 2,
})
const ActualUnion = Union(ActualEnum)

describe('@downforce/std/enum', (ctx) => {
    test('Enum()', (ctx) => {
        {
            const actual = ActualEnum

            expectType<'A'>(actual.A)
            expectType<'B'>(actual.B)
            expectType<1>(actual.C)
            expectType<2>(actual.D)
            Assert.equal(actual.A, 'A')
            Assert.equal(actual.B, 'B')
            Assert.equal(actual.C, 1)
            Assert.equal(actual.D, 2)
        }
    })

    test('Union()', (ctx) => {
        {
            const actual = ActualUnion
            const expected = ['A', 'B', 1, 2]

            Assert.deepEqual(actual, expected)
        }
    })

    test('UnionOf()', (ctx) => {
        {
            type actual = UnionOf<typeof ActualEnum>
            type expected = 'A' | 'B' | 1 | 2

            type _ = AssertType<EqualTypes<actual, expected>>
        }
        {
            type actual = UnionOf<typeof ActualUnion>
            type expected = 'A' | 'B' | 1 | 2

            type _ = AssertType<EqualTypes<actual, expected>>
        }
    })
})

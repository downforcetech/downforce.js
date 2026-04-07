import {clamp, matchNumberBy2, matchNumberCount, matchNumberSign, matchNumber} from '@downforce/std/number'
import {expectType} from '@downforce/std/type'
import Assert from 'node:assert/strict'
import {describe, test} from 'node:test'

describe('@downforce/std/number', (ctx) => {
    test('matchNumber()', (ctx) => {
        {
            const input = undefined as unknown

            matchNumber(input, expectType<number>)
            expectType<number | 'abc'>(matchNumber(input, expectType<number>, unknown => 'abc'))
        }
        {
            const input = undefined as 1 | 2 | undefined | null | string | Array<number>

            matchNumber(input, expectType<1 | 2>)
            matchNumber(input, expectType<1 | 2>, expectType<undefined | null | string | Array<number>>)
        }
    })

    test('matchNumberBy2()', (ctx) => {
        Assert.equal(expectType<'even' | 'odd'>(matchNumberBy2(10, {even: value => 'even', odd: value => 'odd'})), 'even')
        Assert.equal(expectType<'even' | 'odd'>(matchNumberBy2( 5, {even: value => 'even', odd: value => 'odd'})), 'odd')
        Assert.equal(expectType<'even' | 'odd'>(matchNumberBy2(10, {even: 'even', odd: 'odd'})), 'even')
        Assert.equal(expectType<'even' | 'odd'>(matchNumberBy2( 5, {even: 'even', odd: 'odd'})), 'odd')
        Assert.equal(matchNumberBy2(10, {even: value => `even:${value}`, odd: value => `odd:${value}`}), 'even:10')
        Assert.equal(matchNumberBy2( 5, {even: value => `even:${value}`, odd: value => `odd:${value}`}),   'odd:5')
    })

    test('matchNumberSign()', (ctx) => {
        Assert.equal(expectType<'positive' | 'negative' | 'zero'>(matchNumberSign( 100, {positive: value => 'positive', negative: value => 'negative', zero: value => 'zero'})), 'positive')
        Assert.equal(expectType<'positive' | 'negative' | 'zero'>(matchNumberSign(   0, {positive: value => 'positive', negative: value => 'negative', zero: value => 'zero'})), 'zero')
        Assert.equal(expectType<'positive' | 'negative' | 'zero'>(matchNumberSign(-100, {positive: value => 'positive', negative: value => 'negative', zero: value => 'zero'})), 'negative')
        Assert.equal(expectType<'positive' | 'negative' | 'zero'>(matchNumberSign( 100, {positive: 'positive', negative: 'negative', zero: 'zero'})), 'positive')
        Assert.equal(expectType<'positive' | 'negative' | 'zero'>(matchNumberSign(   0, {positive: 'positive', negative: 'negative', zero: 'zero'})), 'zero')
        Assert.equal(expectType<'positive' | 'negative' | 'zero'>(matchNumberSign(-100, {positive: 'positive', negative: 'negative', zero: 'zero'})), 'negative')
        Assert.equal(matchNumberSign( 100, {positive: value => `positive:${value}`, negative: value => `negative:${value}`, zero: value => `zero:${value}`}), 'positive:100')
        Assert.equal(matchNumberSign(   0, {positive: value => `positive:${value}`, negative: value => `negative:${value}`, zero: value => `zero:${value}`}), 'zero:0')
        Assert.equal(matchNumberSign(-100, {positive: value => `positive:${value}`, negative: value => `negative:${value}`, zero: value => `zero:${value}`}), 'negative:-100')
    })

    test('matchNumberCount()', (ctx) => {
        Assert.equal(expectType<'negative' | 'zero' | 'one' | 'many'>(matchNumberCount( 2, {negative: value => 'negative', zero: value => 'zero', one: value => 'one', many: value => 'many'})), 'many')
        Assert.equal(expectType<'negative' | 'zero' | 'one' | 'many'>(matchNumberCount( 1, {negative: value => 'negative', zero: value => 'zero', one: value => 'one', many: value => 'many'})), 'one')
        Assert.equal(expectType<'negative' | 'zero' | 'one' | 'many'>(matchNumberCount( 0, {negative: value => 'negative', zero: value => 'zero', one: value => 'one', many: value => 'many'})), 'zero')
        Assert.equal(expectType<'negative' | 'zero' | 'one' | 'many'>(matchNumberCount(-1, {negative: value => 'negative', zero: value => 'zero', one: value => 'one', many: value => 'many'})), 'negative')
        Assert.equal(expectType<'negative' | 'zero' | 'one' | 'many'>(matchNumberCount( 2, {negative: 'negative', zero: 'zero', one: 'one', many: 'many'})), 'many')
        Assert.equal(expectType<'negative' | 'zero' | 'one' | 'many'>(matchNumberCount( 1, {negative: 'negative', zero: 'zero', one: 'one', many: 'many'})), 'one')
        Assert.equal(expectType<'negative' | 'zero' | 'one' | 'many'>(matchNumberCount( 0, {negative: 'negative', zero: 'zero', one: 'one', many: 'many'})), 'zero')
        Assert.equal(expectType<'negative' | 'zero' | 'one' | 'many'>(matchNumberCount(-1, {negative: 'negative', zero: 'zero', one: 'one', many: 'many'})), 'negative')
        Assert.equal(matchNumberCount( 2, {negative: value => `negative:${value}`, zero: value => `zero:${value}`, one: value => `one:${value}`, many: value => `many:${value}`}), 'many:2')
        Assert.equal(matchNumberCount( 1, {negative: value => `negative:${value}`, zero: value => `zero:${value}`, one: value => `one:${value}`, many: value => `many:${value}`}), 'one:1')
        Assert.equal(matchNumberCount( 0, {negative: value => `negative:${value}`, zero: value => `zero:${value}`, one: value => `one:${value}`, many: value => `many:${value}`}), 'zero:0')
        Assert.equal(matchNumberCount(-1, {negative: value => `negative:${value}`, zero: value => `zero:${value}`, one: value => `one:${value}`, many: value => `many:${value}`}), 'negative:-1')
    })

    test('clamp()', (ctx) => {
        Assert.equal(clamp(10, 15, 10), 10)
        Assert.equal(clamp(-10, 5, 10), 5)
        Assert.equal(clamp(10, 5, -10), 5)
        Assert.equal(clamp(-10, -15, 10), -10)
        Assert.equal(clamp(-10, 15, 10), 10)
        Assert.equal(clamp(10, -15, -10), -10)
        Assert.equal(clamp(10, 15, -10), 10)
    })
})

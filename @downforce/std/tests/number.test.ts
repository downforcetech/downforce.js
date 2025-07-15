import {clamp, whenNumberBy2, whenNumberCount, whenNumberSign} from '@downforce/std/number'
import {expectType} from '@downforce/std/type'
import Assert from 'node:assert'
import {describe, test} from 'node:test'

describe('@downforce/std/number', (ctx) => {
    test('clamp()', (ctx) => {
        Assert.strictEqual(clamp(10, 15, 10), 10)
        Assert.strictEqual(clamp(-10, 5, 10), 5)
        Assert.strictEqual(clamp(10, 5, -10), 5)
        Assert.strictEqual(clamp(-10, -15, 10), -10)
        Assert.strictEqual(clamp(-10, 15, 10), 10)
        Assert.strictEqual(clamp(10, -15, -10), -10)
        Assert.strictEqual(clamp(10, 15, -10), 10)
    })

    test('whenNumberBy2()', (ctx) => {
        Assert.strictEqual(expectType<'even' | 'odd'>(whenNumberBy2(10, {even: value => 'even', odd: value => 'odd'})), 'even')
        Assert.strictEqual(expectType<'even' | 'odd'>(whenNumberBy2( 5, {even: value => 'even', odd: value => 'odd'})), 'odd')
        Assert.strictEqual(expectType<'even' | 'odd'>(whenNumberBy2(10, {even: 'even', odd: 'odd'})), 'even')
        Assert.strictEqual(expectType<'even' | 'odd'>(whenNumberBy2( 5, {even: 'even', odd: 'odd'})), 'odd')
        Assert.strictEqual(whenNumberBy2(10, {even: value => `even:${value}`, odd: value => `odd:${value}`}), 'even:10')
        Assert.strictEqual(whenNumberBy2( 5, {even: value => `even:${value}`, odd: value => `odd:${value}`}),   'odd:5')
    })

    test('whenNumberSign()', (ctx) => {
        Assert.strictEqual(expectType<'positive' | 'negative' | 'zero'>(whenNumberSign( 100, {positive: value => 'positive', negative: value => 'negative', zero: value => 'zero'})), 'positive')
        Assert.strictEqual(expectType<'positive' | 'negative' | 'zero'>(whenNumberSign(   0, {positive: value => 'positive', negative: value => 'negative', zero: value => 'zero'})), 'zero')
        Assert.strictEqual(expectType<'positive' | 'negative' | 'zero'>(whenNumberSign(-100, {positive: value => 'positive', negative: value => 'negative', zero: value => 'zero'})), 'negative')
        Assert.strictEqual(expectType<'positive' | 'negative' | 'zero'>(whenNumberSign( 100, {positive: 'positive', negative: 'negative', zero: 'zero'})), 'positive')
        Assert.strictEqual(expectType<'positive' | 'negative' | 'zero'>(whenNumberSign(   0, {positive: 'positive', negative: 'negative', zero: 'zero'})), 'zero')
        Assert.strictEqual(expectType<'positive' | 'negative' | 'zero'>(whenNumberSign(-100, {positive: 'positive', negative: 'negative', zero: 'zero'})), 'negative')
        Assert.strictEqual(whenNumberSign( 100, {positive: value => `positive:${value}`, negative: value => `negative:${value}`, zero: value => `zero:${value}`}), 'positive:100')
        Assert.strictEqual(whenNumberSign(   0, {positive: value => `positive:${value}`, negative: value => `negative:${value}`, zero: value => `zero:${value}`}), 'zero:0')
        Assert.strictEqual(whenNumberSign(-100, {positive: value => `positive:${value}`, negative: value => `negative:${value}`, zero: value => `zero:${value}`}), 'negative:-100')
    })

    test('whenNumberCount()', (ctx) => {
        Assert.strictEqual(expectType<'negative' | 'zero' | 'one' | 'many'>(whenNumberCount( 2, {negative: value => 'negative', zero: value => 'zero', one: value => 'one', many: value => 'many'})), 'many')
        Assert.strictEqual(expectType<'negative' | 'zero' | 'one' | 'many'>(whenNumberCount( 1, {negative: value => 'negative', zero: value => 'zero', one: value => 'one', many: value => 'many'})), 'one')
        Assert.strictEqual(expectType<'negative' | 'zero' | 'one' | 'many'>(whenNumberCount( 0, {negative: value => 'negative', zero: value => 'zero', one: value => 'one', many: value => 'many'})), 'zero')
        Assert.strictEqual(expectType<'negative' | 'zero' | 'one' | 'many'>(whenNumberCount(-1, {negative: value => 'negative', zero: value => 'zero', one: value => 'one', many: value => 'many'})), 'negative')
        Assert.strictEqual(expectType<'negative' | 'zero' | 'one' | 'many'>(whenNumberCount( 2, {negative: 'negative', zero: 'zero', one: 'one', many: 'many'})), 'many')
        Assert.strictEqual(expectType<'negative' | 'zero' | 'one' | 'many'>(whenNumberCount( 1, {negative: 'negative', zero: 'zero', one: 'one', many: 'many'})), 'one')
        Assert.strictEqual(expectType<'negative' | 'zero' | 'one' | 'many'>(whenNumberCount( 0, {negative: 'negative', zero: 'zero', one: 'one', many: 'many'})), 'zero')
        Assert.strictEqual(expectType<'negative' | 'zero' | 'one' | 'many'>(whenNumberCount(-1, {negative: 'negative', zero: 'zero', one: 'one', many: 'many'})), 'negative')
        Assert.strictEqual(whenNumberCount( 2, {negative: value => `negative:${value}`, zero: value => `zero:${value}`, one: value => `one:${value}`, many: value => `many:${value}`}), 'many:2')
        Assert.strictEqual(whenNumberCount( 1, {negative: value => `negative:${value}`, zero: value => `zero:${value}`, one: value => `one:${value}`, many: value => `many:${value}`}), 'one:1')
        Assert.strictEqual(whenNumberCount( 0, {negative: value => `negative:${value}`, zero: value => `zero:${value}`, one: value => `one:${value}`, many: value => `many:${value}`}), 'zero:0')
        Assert.strictEqual(whenNumberCount(-1, {negative: value => `negative:${value}`, zero: value => `zero:${value}`, one: value => `one:${value}`, many: value => `many:${value}`}), 'negative:-1')
    })
})

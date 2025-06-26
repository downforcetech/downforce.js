import {clamp, whenSign} from '@downforce/std/number'
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

    test('whenSign()', (ctx) => {
        Assert.strictEqual(whenSign( 100, () => '1', () => '2', () => '3'), '1')
        Assert.strictEqual(whenSign(-100, () => '1', () => '2', () => '3'), '2')
        Assert.strictEqual(whenSign(   0, () => '1', () => '2', () => '3'), '3')
    })
})

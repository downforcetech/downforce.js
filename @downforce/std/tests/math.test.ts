import {createScaleLinear} from '@downforce/std/math/math-scale'
import Assert from 'node:assert'
import {describe, test} from 'node:test'

describe('@downforce/std/math', (ctx) => {
    test('createLinearScale()', (ctx) => {
        {
            const scale = createScaleLinear([0, 1], [0, 100])

            Assert.strictEqual(Math.trunc(scale(0)), 0, 'A1')
            Assert.strictEqual(Math.trunc(scale(1)), 100, 'A2')
            Assert.strictEqual(Math.trunc(scale(.5)), 50, 'A3')
            Assert.strictEqual(Math.trunc(scale(-1)), 0, 'A4')
            Assert.strictEqual(Math.trunc(scale(1.1)), 100, 'A5')
        }
        {
            const scale = createScaleLinear([1, 0], [0, 100])

            Assert.strictEqual(Math.trunc(scale(0)), 100, 'B1')
            Assert.strictEqual(Math.trunc(scale(1)), 0, 'B2')
            Assert.strictEqual(Math.trunc(scale(.5)), 50, 'B3')
            Assert.strictEqual(Math.trunc(scale(-1)), 100, 'B4')
            Assert.strictEqual(Math.trunc(scale(1.1)), 0, 'B5')
        }
        {
            const scale = createScaleLinear([0, 1], [100, -100])

            Assert.strictEqual(Math.trunc(scale(0)), 100, 'C1')
            Assert.strictEqual(Math.trunc(scale(1)), -100, 'C2')
            Assert.strictEqual(Math.trunc(scale(.5)), 0, 'C3')
            Assert.strictEqual(Math.trunc(scale(-1)), 100, 'C4')
            Assert.strictEqual(Math.trunc(scale(1.1)), -100, 'C5')
        }

        {
            const scale = createScaleLinear([10, 20], [100, -100])

            Assert.strictEqual(Math.trunc(scale(10)), 100, 'D1')
            Assert.strictEqual(Math.trunc(scale(15)), 0, 'D2')
            Assert.strictEqual(Math.trunc(scale(20)), -100, 'D3')
        }
    })
})

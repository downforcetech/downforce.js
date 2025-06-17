import {streamPromises, wait} from '@downforce/std/async'
import {call} from '@downforce/std/fn'
import {randomInt} from '@downforce/std/random'
import {expectType} from '@downforce/std/type'
import Assert from 'node:assert'
import {describe, test} from 'node:test'

describe('@downforce/std/async', (ctx) => {
    test('streamPromises()', async (ctx) => {
        const expected = {first: 123, second: 'hello'}
        const expectedIterations = Object.values(expected).length

        {
            let actualIterations = 0

            for await (const _ of streamPromises([Promise.resolve(expected.first), Promise.resolve(expected.second)])) {
                actualIterations += 1
            }

            // Assert(actualIterations > 0)
            // Assert(actualIterations <= expectedIterations)
            Assert.strictEqual(actualIterations, 1)
        }

        {
            let actualIterations = 0

            for await (const [
                first,
                second,
            ] of streamPromises([
                wait(randomInt(1, 10)).then(() => Promise.resolve(expected.first)),
                wait(randomInt(1, 10)).then(() => Promise.resolve(expected.second)),
            ])) {
                actualIterations += 1

                expectType<undefined | typeof expected['first']>(first)
                expectType<undefined | typeof expected['second']>(second)

                if (first) {
                    Assert.strictEqual(first, expected.first)
                }
                if (second) {
                    Assert.strictEqual(second, expected.second)
                }
            }

            Assert.strictEqual(actualIterations, expectedIterations)
        }

        {
            let actualIterations = 0

            for await (const {
                first,
                second,
            } of streamPromises({
                first: wait(randomInt(1, 10)).then(() => Promise.resolve(expected.first)),
                second: wait(randomInt(1, 10)).then(() => Promise.resolve(expected.second)),
            })) {
                actualIterations += 1

                expectType<undefined | typeof expected['first']>(first)
                expectType<undefined | typeof expected['second']>(second)

                if (first) {
                    Assert.strictEqual(first, expected.first)
                }
                if (second) {
                    Assert.strictEqual(second, expected.second)
                }
            }

            Assert.strictEqual(actualIterations, expectedIterations)
        }

        {
            const stream = streamPromises([
                wait(randomInt(1, 10)).then(() => Promise.resolve(expected.first)),
                wait(randomInt(1, 10)).then(() => Promise.resolve(expected.second)),
            ])

            const [actualIterations, returnedValue] = await call(async () => {
                let actualIterations = 0

                while (true) {
                    const current = await stream.next()

                    if (current.done) {
                        return [actualIterations, current.value]
                    }

                    actualIterations += 1
                }
            })

            const [first, second] = returnedValue

            expectType<undefined | typeof expected['first']>(first)
            expectType<undefined | typeof expected['second']>(second)

            Assert.strictEqual(actualIterations, expectedIterations)
            Assert.strictEqual(first, expected.first)
            Assert.strictEqual(second, expected.second)
        }

        {
            const stream = streamPromises({
                first: wait(randomInt(1, 10)).then(() => Promise.resolve(expected.first)),
                second: wait(randomInt(1, 10)).then(() => Promise.resolve(expected.second)),
            })

            const [actualIterations, returnedValue] = await call(async () => {
                let actualIterations = 0

                while (true) {
                    const current = await stream.next()

                    if (current.done) {
                        return [actualIterations, current.value]
                    }

                    actualIterations += 1
                }
            })

            const {first, second} = returnedValue

            expectType<undefined | typeof expected['first']>(first)
            expectType<undefined | typeof expected['second']>(second)

            Assert.strictEqual(actualIterations, expectedIterations)
            Assert.strictEqual(first, expected.first)
            Assert.strictEqual(second, expected.second)
        }
    })
})

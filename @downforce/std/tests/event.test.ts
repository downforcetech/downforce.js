import {wait} from '@downforce/std/async'
import {debounced, throttled} from '@downforce/std/event'
import Assert from 'node:assert/strict'
import {describe, test} from 'node:test'

const Delay = 50

describe('@downforce/std/event', {concurrency: true}, (ctx) => {
    test('debounced()', async (ctx) => {
        {
            const calls: Array<number> = []
            const task = debounced((it: number) => { calls.push(it) }, Delay)

            task(1)
            task(2)
            task(3)
            await wait(Delay * 2)

            Assert.deepEqual(calls, [3])
        }
        {
            const calls: Array<number> = []
            const task = debounced((it: number) => { calls.push(it) }, Delay)

            for (const it of [1, 2, 3]) {
                task(it)
                await wait(Delay / 10)
            }
            await wait(Delay * 2)

            Assert.deepEqual(calls, [3])
        }
        {
            const calls: Array<number> = []
            const task = debounced((it: number) => {
                calls.push(it)

                if (it === 1) {
                    task(2)
                }
            }, Delay)

            task(1)
            await wait(Delay * 3)

            Assert.deepEqual(calls, [1, 2])
        }
    })

    test('throttled()', async (ctx) => {
        {
            const calls: Array<number> = []
            const task = throttled((it: number) => { calls.push(it) }, Delay)

            task(1)
            task(2)
            task(3)
            await wait(Delay * 2)

            Assert.deepEqual(calls, [3])
        }
        {
            const calls: Array<number> = []
            const task = throttled((it: number) => { calls.push(it) }, Delay)

            task(1)
            await wait(Delay / 10)
            task(2)
            await wait(Delay / 10)
            task(3)
            await wait(Delay * 2)

            Assert.deepEqual(calls, [1, 3])
        }
        {
            const calls: Array<number> = []
            const task = throttled((it: number) => {
                calls.push(it)

                if (it === 1) {
                    task(2)
                }
            }, Delay)

            task(1)
            await wait(Delay * 2)

            Assert.deepEqual(calls, [1, 2])
        }
    })

    test('throttled({leading: false})', async (ctx) => {
        {
            const calls: Array<number> = []
            const task = throttled((it: number) => { calls.push(it) }, Delay, {leading: false})

            task(1)
            await wait(Delay / 10)

            Assert.deepEqual(calls, [])
            await wait(Delay)
            Assert.deepEqual(calls, [1])
        }
        {
            const calls: Array<number> = []
            const task = throttled((it: number) => { calls.push(it) }, Delay, {leading: false})

            task(1)
            await wait(Delay * 2)
            Assert.deepEqual(calls, [1])

            task(2)
            await wait(Delay / 10)
            Assert.deepEqual(calls, [1, 2])
        }
    })

    test('throttled({trailing: false})', async (ctx) => {
        {
            const calls: Array<number> = []
            const task = throttled((it: number) => { calls.push(it) }, Delay, {trailing: false})

            task(1)
            await wait(Delay / 10)
            task(2)
            await wait(Delay * 2)
            task(3)
            await wait(Delay * 2)

            Assert.deepEqual(calls, [1, 3])
        }
    })
})

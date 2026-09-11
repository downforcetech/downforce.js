import {wait} from '@downforce/std/async'
import type {Task} from '@downforce/std/fn'
import {Reactive, createReactive, createReactiveComputed, createReactiveRef, createReactiveStore, readReactive, watchReactive, writeReactive} from '@downforce/std/reactive'
import Assert from 'node:assert/strict'
import {describe, test} from 'node:test'

// A reactive notification is scheduled on a micro task.
// A macro task ensures every pending micro task has been flushed.
function nextTick(): Promise<void> {
    return wait(0)
}

describe('@downforce/std/reactive', {concurrency: true}, (ctx) => {
    test('createReactive()', async (ctx) => {
        {
            const reactive = createReactive(1)
            Assert.strictEqual(readReactive(reactive), 1)
        }
        {
            const reactive = createReactive({id: 1})
            Assert.strictEqual(String(reactive), '{"id":1}')
            writeReactive(reactive, {id: 2})
            Assert.strictEqual(String(reactive), '{"id":2}')
        }
        {
            Assert.strictEqual(Object.prototype.toString.call(createReactive(1)), '[object Reactive]')
        }
        {
            const value: Record<string, unknown> = {}
            value.self = value
            const reactive = createReactive(value)
            Assert.doesNotThrow(() => String(reactive))
            Assert.strictEqual(String(reactive), '[object Object]')
        }
    })

    test('writeReactive()', async (ctx) => {
        {
            const reactive = createReactive(1)
            Assert.strictEqual(writeReactive(reactive, 2), 2)
            Assert.strictEqual(readReactive(reactive), 2)
        }
        {
            const calls: Array<number> = []
            const reactive = createReactive(1)
            watchReactive(reactive, newValue => { calls.push(newValue) })
            Assert.strictEqual(writeReactive(reactive, 1), 1)
            await nextTick()
            Assert.strictEqual(calls.length, 0)
        }
        {
            const calls: Array<number> = []
            const reactive = createReactive({id: 1}, {equals: (newValue, oldValue) => newValue.id === oldValue.id})
            watchReactive(reactive, newValue => { calls.push(newValue.id) })
            writeReactive(reactive, {id: 1})
            await nextTick()
            Assert.strictEqual(calls.length, 0)
            writeReactive(reactive, {id: 2})
            await nextTick()
            Assert.deepStrictEqual(calls, [2])
        }
        {
            const reactive = createReactive(0, {middleware: newValue => Math.min(newValue, 10)})
            Assert.strictEqual(writeReactive(reactive, 5), 5)
            Assert.strictEqual(writeReactive(reactive, 100), 10)
            Assert.strictEqual(readReactive(reactive), 10)
        }
        {
            const calls: Array<number> = []
            const reactive = createReactive(1, {middleware: () => 1})
            watchReactive(reactive, newValue => { calls.push(newValue) })
            Assert.strictEqual(writeReactive(reactive, 2), 1)
            await nextTick()
            Assert.strictEqual(calls.length, 0)
        }
    })

    test('watchReactive()', async (ctx) => {
        {
            const calls: Array<[number, number]> = []
            const reactive = createReactive(0)
            watchReactive(reactive, (newValue, oldValue) => { calls.push([newValue, oldValue]) })
            writeReactive(reactive, 1)
            Assert.strictEqual(calls.length, 0)
            await nextTick()
            Assert.deepStrictEqual(calls, [[1, 0]])
        }
        {
            const calls: Array<[number, number]> = []
            const reactive = createReactive(0)
            watchReactive(reactive, (newValue, oldValue) => { calls.push([newValue, oldValue]) }, {immediate: true})
            Assert.deepStrictEqual(calls, [[0, 0]])
        }
        {
            const calls: Array<number> = []
            const reactive = createReactive(0)
            const stopWatcher = watchReactive(reactive, newValue => { calls.push(newValue) })
            writeReactive(reactive, 1)
            await nextTick()
            Assert.deepStrictEqual(calls, [1])
            stopWatcher()
            writeReactive(reactive, 2)
            await nextTick()
            Assert.deepStrictEqual(calls, [1])
        }
        {
            // Multiple mutations in the same micro task must be batched,
            // resulting in a single notification carrying as oldValue
            // the value preceding the whole batch.
            const calls: Array<[number, number]> = []
            const reactive = createReactive(0)
            watchReactive(reactive, (newValue, oldValue) => { calls.push([newValue, oldValue]) })
            writeReactive(reactive, 1)
            writeReactive(reactive, 2)
            writeReactive(reactive, 3)
            await nextTick()
            Assert.deepStrictEqual(calls, [[3, 0]])
        }
        {
            // Multiple mutations in the same micro task ending on its initial
            // value must not notify.
            const calls: Array<number> = []
            const reactive = createReactive(0)
            watchReactive(reactive, newValue => { calls.push(newValue) })
            writeReactive(reactive, 1)
            writeReactive(reactive, 0)
            await nextTick()
            Assert.strictEqual(calls.length, 0)
        }
        {
            // A watcher registered after a mutation must not be notified.
            const calls: Array<number> = []
            const reactive = createReactive(0)
            writeReactive(reactive, 1)
            watchReactive(reactive, newValue => { calls.push(newValue) })
            await nextTick()
            Assert.strictEqual(calls.length, 0)
        }
        {
            // A watcher re-registered after a mutation must not be notified,
            // despite having been registered before the mutation.
            const calls: Array<[number, number]> = []
            const reactive = createReactive(0)
            function observer(newValue: number, oldValue: number) { calls.push([newValue, oldValue]) }
            const stopWatcher = watchReactive(reactive, observer)
            stopWatcher()
            writeReactive(reactive, 1)
            watchReactive(reactive, observer)
            await nextTick()
            Assert.strictEqual(calls.length, 0)
        }
        {
            // A watcher registered twice must be notified once,
            // carrying the registration generation of the first registration.
            const calls: Array<[number, number]> = []
            const reactive = createReactive(0)
            function observer(newValue: number, oldValue: number) { calls.push([newValue, oldValue]) }
            watchReactive(reactive, observer)
            writeReactive(reactive, 1)
            watchReactive(reactive, observer)
            await nextTick()
            Assert.deepStrictEqual(calls, [[1, 0]])
        }
        {
            const calls: Array<number> = []
            const reactive = createReactive(0)
            function observer(newValue: number) { calls.push(newValue) }
            const stopWatcher1 = watchReactive(reactive, observer)
            writeReactive(reactive, 1)
            const stopWatcher2 = watchReactive(reactive, observer)
            stopWatcher1() // This must stop watcher1 and watcher2.
            writeReactive(reactive, 2)
            await nextTick()
            Assert.deepStrictEqual(calls, [])
            const stopWatcher3 = watchReactive(reactive, observer)
            stopWatcher2() // This should stop watcher3.
            writeReactive(reactive, 3)
            await nextTick()
            Assert.deepStrictEqual(calls, [])
        }
        {
            const calls: Array<number> = []
            const reactive = createReactive(0)
            function observer(newValue: number) { calls.push(newValue) }
            const stopWatcher1 = watchReactive(reactive, observer)
            stopWatcher1()
            const stopWatcher2 = watchReactive(reactive, observer)
            stopWatcher1() // This must stop watcher1 and watcher2.
            const stopWatcher3 = watchReactive(reactive, observer)
            writeReactive(reactive, 1)
            await nextTick()
            Assert.deepStrictEqual(calls, [1])
            stopWatcher2() // This must stop watcher3.
            writeReactive(reactive, 2)
            stopWatcher3() // Noop.
            await nextTick()
            Assert.deepStrictEqual(calls, [1])
        }
        {
            const calls: Array<number> = []
            const reactive = createReactive(0)
            function observer(newValue: number) { calls.push(newValue) }
            const stopWatcher1 = watchReactive(reactive, observer)
            stopWatcher1()
            const stopWatcher2 = watchReactive(reactive, observer)
            stopWatcher1()
            const stopWatcher3 = watchReactive(reactive, observer)
            stopWatcher3()
            writeReactive(reactive, 1)
            await nextTick()
            Assert.deepStrictEqual(calls, [])
        }
        {
            // A watcher registered on many reactives must be notified by each one,
            // and un-subscribing from a reactive must not affect the other ones.
            const calls: Array<number> = []
            const reactive1 = createReactive(0)
            const reactive2 = createReactive(0)
            function observer(newValue: number) { calls.push(newValue) }
            writeReactive(reactive1, 1)
            await nextTick()
            const stopWatcher1 = watchReactive(reactive1, observer)
            watchReactive(reactive2, observer)
            stopWatcher1()
            writeReactive(reactive2, 2)
            await nextTick()
            Assert.deepStrictEqual(calls, [2])
        }
        {
            // A watcher registered in the middle of a batch is notified
            // with an oldValue carrying the value at the beginning of the batch.
            const calls: Array<[number, number]> = []
            const reactive = createReactive(0)
            writeReactive(reactive, 1)
            watchReactive(reactive, (newValue, oldValue) => { calls.push([newValue, oldValue]) })
            writeReactive(reactive, 2)
            await nextTick()
            Assert.deepStrictEqual(calls, [[2, 0]])
        }
        {
            const calls: Array<[number, number]> = []
            const reactive = createReactive(0)
            watchReactive(reactive, newValue => {
                if (newValue === 1) {
                    writeReactive(reactive, 2)
                }
            })
            writeReactive(reactive, 1)
            watchReactive(reactive, (newValue, oldValue) => { calls.push([newValue, oldValue]) })
            await nextTick()
            Assert.deepStrictEqual(calls, [[2, 1]])
        }
        {
            // A watcher subscribed during a notification must not be notified.
            const calls: Array<number> = []
            const reactive = createReactive(0)
            watchReactive(reactive, () => {
                watchReactive(reactive, newValue => { calls.push(newValue) })
            })
            writeReactive(reactive, 1)
            await nextTick()
            Assert.strictEqual(calls.length, 0)
        }
        {
            // A mutation during a notification must notify after every in progress
            // notification completed.
            const calls: Array<number> = []
            const reactive = createReactive(0)
            watchReactive(reactive, newValue => {
                calls.push(newValue)

                if (newValue === 1) {
                    writeReactive(reactive, 2)
                }
            })
            writeReactive(reactive, 1)
            await nextTick()
            Assert.deepStrictEqual(calls, [1, 2])
        }
        {
            const calls: Array<number> = []
            const reactive = createReactive(0)
            const stopWatcher = watchReactive(reactive, newValue => {
                calls.push(newValue)
                stopWatcher()
            })
            writeReactive(reactive, 1)
            await nextTick()
            writeReactive(reactive, 2)
            await nextTick()
            Assert.deepStrictEqual(calls, [1])
        }
        {
            // A watcher un-subscribed by another watcher before being notified,
            // must be skipped by the notification in progress.
            const calls: Array<number> = []
            const reactive = createReactive(0)
            let stopWatcher2: undefined | Task = undefined
            watchReactive(reactive, () => { stopWatcher2?.() })
            stopWatcher2 = watchReactive(reactive, newValue => { calls.push(newValue) })
            writeReactive(reactive, 1)
            await nextTick()
            Assert.strictEqual(calls.length, 0)
        }
        {
            // A watcher un-subscribed during a re-entrant mutation must be skipped
            // by both the notification in progress and the re-entrant one.
            const calls: Array<number> = []
            const reactive = createReactive(0)
            let stopWatcher2: undefined | Task = undefined
            watchReactive(reactive, newValue => {
                if (newValue === 1) {
                    writeReactive(reactive, 2)
                    stopWatcher2?.()
                }
            })
            stopWatcher2 = watchReactive(reactive, newValue => { calls.push(newValue) })
            writeReactive(reactive, 1)
            await nextTick()
            Assert.strictEqual(calls.length, 0)
        }
        {
            // A watcher un-subscribed by another watcher before being notified,
            // must be skipped by the notification in progress.
            const calls: Array<number> = []
            const reactive = createReactive(0)
            let stopWatcher2: undefined | Task = undefined
            watchReactive(reactive, newValue => {
                if (newValue === 1) {
                    watchReactive(reactive, () => {})
                    writeReactive(reactive, 2)
                    stopWatcher2?.()
                }
            })
            stopWatcher2 = watchReactive(reactive, newValue => { calls.push(newValue) })
            writeReactive(reactive, 1)
            await nextTick()
            Assert.strictEqual(calls.length, 0)
        }
        {
            // Every watcher is notified with a coherent pair of values, even when
            // another watcher mutates the value in the middle of the notification.
            const calls: Array<[number, number]> = []
            const reactive = createReactive(0)
            watchReactive(reactive, newValue => {
                if (newValue === 1) {
                    writeReactive(reactive, 2)
                }
            })
            watchReactive(reactive, (newValue, oldValue) => { calls.push([newValue, oldValue]) })
            writeReactive(reactive, 1)
            await nextTick()
            Assert.deepStrictEqual(calls, [[1, 0], [2, 1]])
        }
    })

    test('createReactiveComputed()', async (ctx) => {
        {
            const reactiveSource = createReactive(0)
            writeReactive(reactiveSource, 1)
            const reactiveComputed = createReactiveComputed([reactiveSource], value => value * 2)
            Assert.strictEqual(reactiveComputed.value, 2)
            writeReactive(reactiveSource, 2)
            await nextTick()
            Assert.strictEqual(reactiveComputed.value, 4)
        }
        {
            const reactiveA = createReactive(2)
            const reactiveB = createReactive(3)
            const reactiveComputed = createReactiveComputed([reactiveA, reactiveB], (a, b) => a * b)
            Assert.strictEqual(reactiveComputed.read(), 6)
            writeReactive(reactiveA, 4)
            writeReactive(reactiveB, 5)
            await nextTick()
            Assert.strictEqual(reactiveComputed.read(), 20)
        }
        {
            const reactiveSource = createReactive(1)
            const calls: Array<number> = []
            const reactiveComputed = createReactiveComputed([reactiveSource], value => { calls.push(value); return value * 2 })
            Assert.strictEqual(reactiveComputed.value, 2)
            Assert.deepStrictEqual(calls, [1])
            watchReactive(reactiveSource, () => { void reactiveComputed.value })
            writeReactive(reactiveSource, 2)
            await nextTick()
            Assert.strictEqual(reactiveComputed.value, 4)
            Assert.deepStrictEqual(calls, [1, 2])
        }
        {
            const reactiveSource = createReactive(1)
            const reactiveComputed1 = createReactiveComputed([reactiveSource], value => value + 1)
            const reactiveComputed2 = createReactiveComputed([reactiveComputed1], value => value * 10)
            const reactiveComputed3 = createReactiveComputed([reactiveComputed2], value => value + 100)
            writeReactive(reactiveSource, 4)
            await nextTick()
            Assert.strictEqual(reactiveComputed1.value, 5)
            Assert.strictEqual(reactiveComputed2.value, 50)
            Assert.strictEqual(reactiveComputed3.value, 150)
        }
        {
            const calls: Array<[number, number]> = []
            const reactiveSource = createReactive(1)
            const reactiveComputed = createReactiveComputed([reactiveSource], value => value * 2)
            watchReactive(reactiveComputed, (newValue, oldValue) => { calls.push([newValue, oldValue]) })
            writeReactive(reactiveSource, 5)
            await nextTick()
            Assert.deepStrictEqual(calls, [[10, 2]])
        }
        {
            const reactiveSource = createReactive(1)
            const reactiveComputed = createReactiveComputed([reactiveSource], value => value * 2)
            writeReactive(reactiveSource, 2)
            await nextTick()
            Assert.strictEqual(reactiveComputed.value, 4)
            reactiveComputed.clean()
            writeReactive(reactiveSource, 3)
            await nextTick()
            Assert.strictEqual(reactiveComputed.value, 4)
        }
        {
            const reactiveSource = createReactive(1)
            const reactiveComputed = createReactiveComputed([reactiveSource], value => value * 2)
            watchReactive(reactiveSource, () => { reactiveComputed.clean() })
            writeReactive(reactiveSource, 2)
            await nextTick()
            Assert.strictEqual(reactiveComputed.value, 2)
        }
        {
            const calls: Array<number> = []
            const reactiveSourceA = createReactive(1)
            const reactiveSourceB = createReactive(1)
            const reactiveComputed1 = createReactiveComputed([reactiveSourceA], a => a * 10)
            const reactiveComputed2 = createReactiveComputed([reactiveSourceB, reactiveComputed1], (b, c1) => b * 100 + c1)
            watchReactive(reactiveComputed2, newValue => { calls.push(newValue) })
            writeReactive(reactiveSourceB, 2)
            writeReactive(reactiveSourceA, 2)
            await nextTick()
            Assert.deepStrictEqual(calls, [220])
        }
    })

    test('createReactiveRef()', async (ctx) => {
        {
            const calls: Array<number> = []
            const reactiveRef = createReactiveRef(1)
            Assert.strictEqual(reactiveRef.value, 1)
            const stopWatcher = reactiveRef.watch(newValue => { calls.push(newValue) })
            reactiveRef.value = 2
            await nextTick()
            Assert.strictEqual(reactiveRef.value, 2)
            Assert.deepStrictEqual(calls, [2])
            stopWatcher()
            reactiveRef.value = 3
            await nextTick()
            Assert.strictEqual(reactiveRef.value, 3)
            Assert.deepStrictEqual(calls, [2])
        }
    })

    test('createReactiveStore()', async (ctx) => {
        {
            const calls: Array<number> = []
            const reactiveStore = createReactiveStore(1)
            Assert.strictEqual(reactiveStore.read(), 1)
            reactiveStore.watch(newValue => { calls.push(newValue) })
            Assert.strictEqual(reactiveStore.write(2), 2)
            await nextTick()
            Assert.strictEqual(reactiveStore.read(), 2)
            Assert.deepStrictEqual(calls, [2])
        }
    })

    test('Reactive', async (ctx) => {
        {
            const calls: Array<number> = []
            const reactive = Reactive.create(1)
            Assert.strictEqual(Reactive.read(reactive), 1)
            Assert.strictEqual(Reactive.write(reactive, 2), 2)
            await nextTick()
            Reactive.watch(reactive, newValue => { calls.push(newValue) })
            Reactive.write(reactive, 3)
            await nextTick()
            Assert.strictEqual(Reactive.read(reactive), 3)
            Assert.deepStrictEqual(calls, [3])
        }
    })
})

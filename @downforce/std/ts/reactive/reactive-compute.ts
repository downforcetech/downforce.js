import {scheduleMicroTask} from '../eventloop.js'
import {call} from '../fn/fn-call.js'
import type {Task} from '../fn/fn-type.js'
import {readReactive, watchReactive, writeReactive} from './reactive-mix.js'
import {createReactive} from './reactive-new.js'
import type {ReactiveOptions, ReactiveObject, ReactiveValuesOf} from './reactive-type.js'

export function createReactiveComputed<A extends Array<ReactiveObject<any>>, V>(
    reactives: readonly [...A],
    computer: (...args: ReactiveValuesOf<A>) => V,
    options?: undefined | ReactiveOptions<V>,
): ReactiveComputed<V> {
    const reactive = createReactive(compute(), options)

    let cancelScheduledUpdate: undefined | Task

    function compute(): V {
        const args = reactives.map(readReactive) as ReactiveValuesOf<A>
        return computer(...args)
    }

    function update(): void {
        writeReactive(reactive, compute())
    }

    function scheduleUpdate(): void {
        cancelScheduledUpdate ??= scheduleMicroTask(() => {
            cancelScheduledUpdate = undefined
            update()
        })
    }

    const cleanUpList = reactives.map(reactive =>
        // We watch every reactive, scheduling an update on every change.
        // We recompute using a scheduled update to batch multiple
        // simultaneous updates of the watched reactives.
        watchReactive(reactive, scheduleUpdate)
    )

    function read(): V {
        return readReactive(reactive)
    }

    function clean(): void {
        cancelScheduledUpdate?.()
        cleanUpList.forEach(call)
    }

    return {
        ...reactive,
        get value() {
            return read()
        },
        read,
        clean,
    }
}

// Types ///////////////////////////////////////////////////////////////////////

export interface ReactiveComputed<V> extends ReactiveObject<V> {
    get value(): V
    read(): V
    clean(): void
}

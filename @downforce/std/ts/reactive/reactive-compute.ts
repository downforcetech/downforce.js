import {scheduleMicroTask} from '../eventloop.js'
import {call} from '../fn/fn-call.js'
import type {Task} from '../fn/fn-type.js'
import {readReactive, watchReactive, writeReactive} from './reactive-mix.js'
import {createReactive} from './reactive-new.js'
import type {ReactiveObject, ReactiveOptions, ReactiveValuesOf} from './reactive-type.js'

export function createReactiveComputed<A extends Array<ReactiveObject<any> | ReactiveComputed<V>>, V>(
    reactiveDeps: readonly [...A],
    computer: (...args: ReactiveValuesOf<A>) => V,
    options?: undefined | ReactiveOptions<V>,
): ReactiveComputed<V> {
    function compute(): V {
        const args = reactiveDeps.map(reactiveDep => {
            if ('read' in reactiveDep) {
                return reactiveDep.read()
            }

            return readReactive(reactiveDep)
        }) as ReactiveValuesOf<A>

        return computer(...args)
    }

    function read(): V {
        if (state.dirty) {
            write()
        }

        return readReactive(reactive)
    }

    function write(): undefined {
        writeReactive(reactive, compute())
        state.dirty = false
    }

    function clean(): undefined {
        state.dirty = false
        state.cancelScheduledUpdate?.()
        state.cancelScheduledUpdate = undefined
        state.cleanUpList.forEach(call)
    }

    const state: {
        cancelScheduledUpdate: undefined | Task
        cleanUpList: Array<Task>
        dirty: boolean
    } = {
        cancelScheduledUpdate: undefined,
        cleanUpList: [],
        dirty: false,
    }

    const reactive = createReactive(compute(), options)

    state.cleanUpList = reactiveDeps.map(reactiveDep => {
        const onClean = watchReactive(reactiveDep, () => {
            state.dirty = true

            // We watch every reactive, scheduling an update on every change.
            // We recompute using a scheduled update to batch multiple updates
            // of the watched reactive deps.
            state.cancelScheduledUpdate ??= scheduleMicroTask(() => {
                state.cancelScheduledUpdate = undefined

                if (! state.dirty) {
                    return
                }

                write()
            })
        })

        return onClean
    })

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
    clean(): undefined
}

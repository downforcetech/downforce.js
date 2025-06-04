import {createReactiveComputed} from './reactive-compute.js'
import {readReactive, watchReactive, writeReactive} from './reactive-mix.js'
import {createReactive} from './reactive-new.js'
import {createReactiveRef} from './reactive-ref.js'
import {createReactiveStore} from './reactive-store.js'

export const Reactive: {
    create: typeof createReactive
    read: typeof readReactive
    write: typeof writeReactive
    watch: typeof watchReactive
    Computed: typeof createReactiveComputed
    Ref: typeof createReactiveRef
    Store: typeof createReactiveStore
} = {
    create: createReactive,
    read: readReactive,
    write: writeReactive,
    watch: watchReactive,
    Computed: createReactiveComputed,
    Ref: createReactiveRef,
    Store: createReactiveStore,
}

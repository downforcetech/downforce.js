import type {Task} from '../fn/fn-type.js'
import type {ReadWriteSync} from '../store/store-rw.js'
import {readReactive, watchReactive, writeReactive} from './reactive-mix.js'
import {createReactive} from './reactive-new.js'
import type {ReactiveObserver, ReactiveOptions, ReactiveObject, ReactiveWatchOptions} from './reactive-type.js'

export function createReactiveStore<V>(
    value: V,
    options?: undefined | ReactiveOptions<NoInfer<V>>,
): ReactiveStore<V> {
    const reactive = createReactive(value, options)

    function read(): V {
        return readReactive(reactive)
    }

    function write(newValue: V): V {
        return writeReactive(reactive, newValue)
    }

    function watch(observer: ReactiveObserver<V>, options?: undefined | ReactiveWatchOptions): Task {
        return watchReactive(reactive, observer, options)
    }

    return {...reactive, read, write, watch}
}

// Types ///////////////////////////////////////////////////////////////////////

export interface ReactiveStore<V> extends ReadWriteSync<V>, ReactiveObject<V> {
    watch(observer: ReactiveObserver<V>, options?: undefined | ReactiveWatchOptions): Task
}

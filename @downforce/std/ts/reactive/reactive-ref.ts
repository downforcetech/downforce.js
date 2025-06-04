import type {Task} from '../fn.js'
import type {ValueRef} from '../store.js'
import {readReactive, watchReactive, writeReactive} from './reactive-mix.js'
import {createReactive} from './reactive-new.js'
import type {ReactiveObserver, ReactiveOptions, ReactiveProtocol, ReactiveWatchOptions} from './reactive-type.js'

export function createReactiveRef<V>(
    value: V,
    options?: undefined | ReactiveOptions<NoInfer<V>>,
): ReactiveRef<V> {
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

    return {
        ...reactive,
        get value() {
            return read()
        },
        set value(value) {
            write(value)
        },
        watch,
    }
}

// Types ///////////////////////////////////////////////////////////////////////

export interface ReactiveRef<V> extends ValueRef<V>, ReactiveProtocol<V> {
    watch(observer: ReactiveObserver<V>, options?: undefined | ReactiveWatchOptions): Task
}

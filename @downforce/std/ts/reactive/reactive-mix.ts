import {scheduleMicroTask} from '../eventloop.js'
import type {Task} from '../fn.js'
import {ReactiveStateSymbol} from './reactive-new.js'
import type {ReactiveObserver, ReactiveProtocol, ReactiveState, ReactiveWatchOptions} from './reactive-type.js'

export function getReactiveState<V>(reactive: ReactiveProtocol<V>): ReactiveState<V> {
    return reactive[ReactiveStateSymbol]!
}

export function readReactive<V>(reactive: ReactiveProtocol<V>): V {
    return getReactiveState(reactive).value
}

export function writeReactive<V>(reactive: ReactiveProtocol<V>, value: V): V {
    const state = getReactiveState(reactive)
    const areEqual = state.comparator

    if (areEqual(state.value, value)) {
        return state.value
    }

    const middleware = state.middleware
    const newValue = middleware
        ? middleware(value, state.value)
        : value

    if (areEqual(state.value, newValue)) {
        return state.value
    }

    const previousNotifiedValue = state.value
    state.value = newValue

    // We notify once multiple mutations in the same micro task.
    // We schedule a micro task so that if an observer triggers a value mutation,
    // the reentrant mutation is notified after current one is notified.
    state.notification ??= scheduleMicroTask(() => {
        state.notification = undefined

        if (areEqual(state.value, previousNotifiedValue)) {
            // Multiple mutations in the same batch can result in the end value
            // as the initial one.
            // EXAMPLE
            // value = 0; write(1); write(0);
            // No notification is needed in this case.
            return
        }

        // We use a stable value as notified value, instead of state.value,
        // because an observer could change state.value as response to a notification.
        // In this way all observers are notified with a coherent value.
        const notifiedValue = state.value

        for (const it of state.observers) {
            it(notifiedValue, previousNotifiedValue)
        }
    })

    return state.value
}

export function watchReactive<V>(
    reactive: ReactiveProtocol<V>,
    observer: ReactiveObserver<V>,
    options?: undefined | ReactiveWatchOptions,
): Task {
    const state = getReactiveState(reactive)
    const {observers} = state
    const immediate = options?.immediate ?? false

    observers.add(observer)

    if (immediate) {
        observer(state.value, state.value)
    }

    function stop() {
        observers.delete(observer)
    }

    return stop
}

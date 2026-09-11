import {scheduleMicroTask} from '../eventloop.js'
import {call} from '../fn/fn-call.js'
import type {Task} from '../fn/fn-type.js'
import {ReactiveStateSymbol} from './reactive-new.js'
import type {ReactiveObject, ReactiveObserver, ReactiveObserverState, ReactiveState, ReactiveWatchOptions} from './reactive-type.js'

export function getReactiveState<V>(reactive: ReactiveObject<V>): ReactiveState<V> {
    return reactive[ReactiveStateSymbol]!
}

export function readReactive<V>(reactive: ReactiveObject<V>): V {
    return getReactiveState(reactive).value
}

export function writeReactive<V>(reactive: ReactiveObject<V>, value: V): V {
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

    const oldValue = state.value
    state.notificationGeneration = state.generation
    state.value = newValue
    state.generation += 1

    if (! state.notificationCleanup) {
        // We notify once multiple mutations in the same micro task.
        // We schedule a micro task so that if an observer triggers a value mutation,
        // the reentrant mutation is notified after current one is notified.
        state.notificationCleanup = scheduleMicroTask(() => {
            state.notificationCleanup = undefined

            if (areEqual(state.value, oldValue)) {
                // Multiple mutations in the same batch can result in the end value
                // as the initial one.
                // EXAMPLE: value=0; write(1); write(0).
                // No notification is needed in this case.
                return
            }

            // We use a stable value as notified value, instead of state.value,
            // because an observer could mutate state.value as response to a notification.
            // In this way all observers are notified with a coherent value.
            const newValueSnapshot = state.value

            // We use a stable generation as notification generation,
            // because an observer could mutate state.notificationGeneration
            // with a re-entrant mutation as response to a notification.
            const notificationGeneration = state.notificationGeneration

            const compactionThreshold = Math.max(10, state.observersList.length * 0.1) // 10%.
            let observersListNeedsCompaction = 0

            // We iterate the live observers, so that an observer un-subscribed by another
            // observer is skipped, protecting against the re-entrant un-subscription.
            for (const it of state.observersList) {
                const {observer} = it
                // We destructure the observer for faster access and for preventing
                // it from accessing the internal state thorough `this`.

                if (! observer) {
                    // Observer has been stopped during the notification phase.
                    observersListNeedsCompaction += 1
                    continue
                }
                if (it.generation > notificationGeneration) {
                    // We notify only the observers registered at the moment of the mutation.
                    // We skip the observers arrived after the state.value mutation.
                    continue
                }

                observer(newValueSnapshot, oldValue)
            }

            if (observersListNeedsCompaction >= compactionThreshold) {
                // In-place compact is faster than .filter().
                const {observersList} = state
                let compactIdx = 0

                for (let idx = 0, listSize = observersList.length; idx < listSize; ++idx) {
                    const it = observersList[idx]

                    if (! it || ! it.observer) {
                        // Observer has been stopped. We drop it.
                        continue
                    }

                    observersList[compactIdx] = it
                    compactIdx += 1
                }

                observersList.length = compactIdx
            }
        })
    }

    return state.value
}

export function watchReactive<V>(
    reactive: ReactiveObject<V>,
    observer: ReactiveObserver<V>,
    options?: undefined | ReactiveWatchOptions,
): Task {
    const state = getReactiveState(reactive)
    const immediate = options?.immediate ?? false

    // An already registered observer keeps its registration generation.
    const observerState: ReactiveObserverState<V> = state.observersMap.get(observer) ?? call(() => {
        const observerState: ReactiveObserverState<V> = {
            observer: observer,
            generation: state.generation,
        }

        state.observersList.push(observerState)
        state.observersMap.set(observer, observerState)

        return observerState
    })

    if (immediate) {
        observer(state.value, state.value)
    }

    function stop(): undefined {
        if (! observerState.observer) {
            // We have already stopped the observer.
            // We must not interfere with a later subscription of the same observer.
            return
        }

        observerState.observer = undefined
        state.observersMap.delete(observer)
    }

    return stop
}

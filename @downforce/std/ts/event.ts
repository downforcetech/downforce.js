import {call} from './fn/fn-call.js'
import type {Fn, FnArgs} from './fn/fn-type.js'
import {isDefined, isUndefined} from './optional/optional-is.js'

export function debounced<A extends FnArgs>(
    task: Fn<A>,
    delay: number,
): EventTask<A> {
    const state: {
        callArgs: undefined | A
        callTime: undefined | number
        timeoutId: undefined | ReturnType<typeof setTimeout>
    } = {
        callArgs: undefined,
        callTime: undefined,
        timeoutId: undefined,
    }

    function callTask(...args: A): undefined {
        if (! callTask.enabled) {
            return
        }

        state.callArgs = args
        state.callTime = performance.now()

        if (isDefined(state.timeoutId)) {
            return
        }

        state.timeoutId = setTimeout(runTask, delay)
    }

    function runTask(): undefined {
        state.timeoutId = undefined

        if (! state.callArgs) {
            return
        }
        if (isUndefined(state.callTime)) {
            return
        }

        const timeElapsedSinceCallTime = performance.now() - state.callTime

        if (timeElapsedSinceCallTime < delay) {
            state.timeoutId = setTimeout(runTask, delay - timeElapsedSinceCallTime)
        }
        else {
            const args = state.callArgs // Supports re-entrant calls.
            state.callArgs = undefined // Releases captured memory.

            task(...args)
        }
    }

    function cancel(): undefined {
        if (isDefined(state.timeoutId)) {
            clearTimeout(state.timeoutId)
        }
        state.callArgs = undefined // Releases captured memory.
        state.timeoutId = undefined
    }

    function disable(): undefined {
        callTask.enabled = false
        cancel()
    }

    function enable(): undefined {
        callTask.enabled = true
    }

    callTask.enabled = true
    callTask.cancel = cancel
    callTask.disable = disable
    callTask.enable = enable

    return callTask
}

export function throttled<A extends FnArgs>(
    task: Fn<A>,
    delay: number,
    options?: undefined | ThrottledOptions,
): EventTask<A> {
    const leading = options?.leading ?? true
    const trailing = options?.trailing ?? true

    const state: {
        callArgs: undefined | A
        runTime: undefined | number
        timeoutId: undefined | ReturnType<typeof setTimeout>
    } = {
        callArgs: undefined,
        runTime: undefined,
        timeoutId: undefined,
    }

    function callTask(...args: A): undefined {
        if (! callTask.enabled) {
            return
        }

        state.callArgs = args

        if (isDefined(state.timeoutId)) {
            return
        }

        const runDelay = call(() => {
            if (isUndefined(state.runTime)) {
                return leading ? 0 : delay
            }

            const timeElapsedSinceRunTime = performance.now() - state.runTime

            if (timeElapsedSinceRunTime >= delay) {
                return 0
            }

            // timeElapsedSinceRunTime < delay
            return trailing ? (delay - timeElapsedSinceRunTime) : undefined
        })

        if (isUndefined(runDelay)) {
            state.callArgs = undefined // Releases captured memory.
            return
        }

        state.timeoutId = setTimeout(runTask, runDelay)
    }

    function runTask(): undefined {
        state.timeoutId = undefined

        if (! state.callArgs) {
            return
        }

        state.runTime = performance.now()

        const args = state.callArgs // Supports re-entrant calls.
        state.callArgs = undefined // Releases captured memory.

        task(...args)
    }

    function cancel(): undefined {
        if (isDefined(state.timeoutId)) {
            clearTimeout(state.timeoutId)
        }
        state.callArgs = undefined // Releases captured memory.
        state.timeoutId = undefined
    }

    function disable(): undefined {
        callTask.enabled = false
        cancel()
    }

    function enable(): undefined {
        callTask.enabled = true
    }

    callTask.enabled = true
    callTask.cancel = cancel
    callTask.disable = disable
    callTask.enable = enable

    return callTask
}

// Types ///////////////////////////////////////////////////////////////////////

export interface EventTask<A extends FnArgs = []> {
    (...args: A): undefined
    cancel(): undefined
    disable(): undefined
    enable(): undefined
    readonly enabled: boolean
}

export interface ThrottledOptions {
    leading?: undefined | boolean
    trailing?: undefined | boolean
}

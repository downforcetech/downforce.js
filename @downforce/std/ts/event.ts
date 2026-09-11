import {call} from './fn/fn-call.js'
import type {Fn, FnArgs, Task} from './fn/fn-type.js'
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

    const controller = createEventTaskController({
        onCancel: cancel,
        onDisable: cancel,
        onEnable: undefined,
    })

    function taskWrapper(...args: A): undefined {
        if (! controller.enabled) {
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

    taskWrapper.controller = controller

    return taskWrapper
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

    const controller = createEventTaskController({
        onCancel: cancel,
        onDisable: cancel,
        onEnable: undefined,
    })

    function taskWrapper(...args: A): undefined {
        if (! controller.enabled) {
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

    taskWrapper.controller = controller

    return taskWrapper
}

export function createEventTaskController(args: {
    onCancel: undefined | Task
    onDisable: undefined | Task
    onEnable: undefined | Task
}): EventTaskController {
    const state: {
        enabled: boolean
    } = {
        enabled: true,
    }

    const self: EventTaskController = {
        get enabled() {
            return state.enabled
        },
        cancel() {
            args.onCancel?.()
        },
        disable() {
            if (! state.enabled) {
                return
            }

            state.enabled = false

            args.onDisable?.()
        },
        enable() {
            if (state.enabled) {
                return
            }

            state.enabled = true

            args.onEnable?.()
        },
    }

    return self
}

// Types ///////////////////////////////////////////////////////////////////////

export interface EventTask<A extends FnArgs = []> {
    (...args: A): undefined
    readonly controller: EventTaskController
}

export interface ThrottledOptions {
    leading?: undefined | boolean
    trailing?: undefined | boolean
}

export interface EventTaskController {
    readonly enabled: boolean
    cancel(): undefined
    disable(): undefined
    enable(): undefined
}

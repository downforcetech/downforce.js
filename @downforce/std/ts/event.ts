import type {Fn, FnArgs} from './fn/fn-type.js'
import {isDefined, isUndefined} from './optional/optional-is.js'
import type {Void} from './type/type-type.js'

export function debounced<A extends FnArgs>(task: Fn<A>, delay: number): EventTask<A> {
    interface State {
        lastCallArgs: undefined | A
        lastCallTime: undefined | number
        timeoutId: undefined | ReturnType<typeof setTimeout>
    }

    const state: State = {
        lastCallArgs: undefined,
        lastCallTime: undefined,
        timeoutId: undefined,
    }

    function call(...args: A): undefined {
        if (! call.enabled) {
            return
        }

        state.lastCallArgs = args
        state.lastCallTime = Date.now()

        if (isDefined(state.timeoutId)) {
            return
        }

        state.timeoutId = setTimeout(run, delay)
    }

    function run(): undefined {
        state.timeoutId = undefined

        if (isUndefined(state.lastCallArgs)) {
            return
        }
        if (isUndefined(state.lastCallTime)) {
            return
        }

        const timeElapsed = Date.now() - state.lastCallTime
        const timeIsExpired = timeElapsed >= delay

        if (! timeIsExpired) {
            const delayRemaining = delay - timeElapsed
            state.timeoutId = setTimeout(run, delayRemaining)
            return
        }

        task(...state.lastCallArgs)
    }

    function cancel(): undefined {
        if (isUndefined(state.timeoutId)) {
            return
        }

        clearTimeout(state.timeoutId)
        state.timeoutId = undefined
    }

    function disable(): undefined {
        call.enabled = false
        cancel()
    }

    function enable(): undefined {
        call.enabled = true
    }

    call.enabled = true
    call.cancel = cancel
    call.disable = disable
    call.enable = enable

    return call
}

export function throttled<A extends FnArgs>(task: Fn<A>, delay: number): EventTask<A> {
    interface State {
        lastCallArgs: undefined | A
        timeoutId: undefined | ReturnType<typeof setTimeout>
    }

    const state: State = {
        lastCallArgs: undefined,
        timeoutId: undefined,
    }

    function call(...args: A): undefined {
        if (! call.enabled) {
            return
        }

        state.lastCallArgs = args

        if (isDefined(state.timeoutId)) {
            return
        }

        state.timeoutId = setTimeout(run, delay)
    }

    function run(): undefined {
        state.timeoutId = undefined

        if (isUndefined(state.lastCallArgs)) {
            return
        }

        task(...state.lastCallArgs)
    }

    function cancel(): undefined {
        if (isUndefined(state.timeoutId)) {
            return
        }

        clearTimeout(state.timeoutId)
        state.timeoutId = undefined
    }

    function disable(): undefined {
        call.enabled = false
        cancel()
    }

    function enable(): undefined {
        call.enabled = true
    }

    call.enabled = true
    call.cancel = cancel
    call.disable = disable
    call.enable = enable

    return call
}

// Types ///////////////////////////////////////////////////////////////////////

export interface EventTask<A extends FnArgs = []> extends Fn<A, undefined> {
    cancel(): undefined
    disable(): undefined
    enable(): undefined
    readonly enabled: boolean
}

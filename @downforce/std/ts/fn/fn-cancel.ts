import type {Fn, FnArgs, Task} from './fn-type.js'

export function cancelable<A extends FnArgs, R>(
    fn: Fn<A, R>,
    onCancel?: undefined | Task,
): FnCancelable<A, R> {
    function run(...args: A): undefined | R {
        if (run.canceled) {
            return
        }

        return fn(...args)
    }

    function cancel() {
        run.canceled = true

        onCancel?.()
    }

    run.canceled = false
    run.cancel = cancel

    return run
}

export function createCancelable<A extends FnArgs, R>(
    fn: Fn<A, R>,
    onCancel?: undefined | Task,
): [Fn<A, undefined | R>, Task, Task<boolean>] {
    const taskCancelable = cancelable(fn, onCancel)

    return [
        taskCancelable,
        taskCancelable.cancel,
        () => taskCancelable.canceled,
    ]
}

// Types ///////////////////////////////////////////////////////////////////////

export interface FnCancelable<A extends FnArgs = [], R = void> extends Fn<A, undefined | R>, FnCancelableState, FnCancelableProtocol {
}

export interface FnCancelableState {
    readonly canceled: boolean
}

export interface FnCancelableProtocol {
    cancel(): void
}

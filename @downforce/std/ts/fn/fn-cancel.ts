import type {Fn, FnArgs, Task} from './fn-type.js'

export function createCancelable<A extends FnArgs, R>(
    fn: Fn<A, R>,
): [Fn<A, undefined | R>, Task, Task<boolean>] {
    let canceled = false

    function taskCancelable(...args: A): undefined | R {
        if (canceled) {
            return
        }

        return fn(...args)
    }

    function cancel(): undefined {
        canceled = true
    }

    function getCanceled() {
        return canceled
    }

    return [taskCancelable, cancel, getCanceled]
}

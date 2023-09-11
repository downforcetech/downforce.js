import type {Fn, FnArgs, Task} from './fn.js'

export function asCancelable<A extends FnArgs, R>(
    task: Fn<A, R>,
    onCancel?: undefined | Task,
): CancelableTuple<A, R> {
    const taskCancelable = createCancelable(task, onCancel)

    return [
        taskCancelable,
        taskCancelable.cancel,
        () => taskCancelable.canceled,
    ]
}

export function createCancelable<A extends FnArgs, R>(
    task: Fn<A, R>,
    onCancel?: undefined | Task,
): CancelableFn<A, R> {
    function run(...args: A): undefined | R {
        if (run.canceled) {
            return
        }

        return task(...args)
    }

    function cancel() {
        run.canceled = true

        onCancel?.()
    }

    run.cancel = cancel
    run.canceled = false

    return run
}

// Types ///////////////////////////////////////////////////////////////////////

export interface CancelableFn<A extends FnArgs = [], R = void> extends Fn<A, undefined | R>, CancelableProtocol {
}

export type CancelableTuple<A extends FnArgs, R> = [
    Fn<A, undefined | R>,
    Task,
    Task<boolean>,
]

export interface CancelableProtocol {
    readonly canceled: boolean
    cancel: Task
}

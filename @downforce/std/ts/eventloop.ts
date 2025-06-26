import {createCancelable} from './fn/fn-cancel.js'
import type {Task} from './fn/fn-type.js'

export function scheduleMicroTask(task: Task): Task {
    const [taskCancelable, cancelTask] = createCancelable(task)

    queueMicrotask(taskCancelable)

    return cancelTask
}

export function scheduleMicroTaskUsingPromise(task: Task): Task {
    const [taskCancelable, cancelTask] = createCancelable(task)

    Promise.resolve().then(taskCancelable)

    return cancelTask
}

export function scheduleMacroTaskUsingTimeout(task: Task): Task {
    const timeoutId = setTimeout(task, 0)

    function cancelTask() {
        clearTimeout(timeoutId)
    }

    return cancelTask
}

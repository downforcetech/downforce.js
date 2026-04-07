import {noop} from '../fn/fn-return.js'
import type {Task} from '../fn/fn-type.js'

export function createTaskRepeater(
    task: Task,
    delay: number,
    options?: undefined | TaskRepeaterOptions,
): TaskRepeater {
    const self: TaskRepeater = {
        delay: delay,
        immediate: options?.immediate ?? true,
        running: false,
        task: task,
        clean: noop,

        start() {
            return startTaskRepeater(self)
        },
        stop() {
            return stopTaskRepeater(self)
        },
    }

    return self
}

export function startTaskRepeater(self: TaskRepeater): Task {
    if (self.running) {
        // Already running. We have nothing to do.
        return self.stop
    }

    self.running = true

    if (self.immediate) {
        executeTaskRepeaterTask(self)
    }
    else {
        self.clean = scheduleTaskRepeaterTask(self)
    }

    return self.stop
}

export function stopTaskRepeater(self: TaskRepeater): undefined {
    self.running = false

    self.clean()
    self.clean = noop
}

export function scheduleTaskRepeaterTask(self: TaskRepeater): Task {
    if (! self.running) {
        return noop
        // Loop has been stopped. We must not reschedule a new execution.
    }

    const id = setTimeout(executeTaskRepeaterTask, self.delay, self)

    function clean(): undefined {
        clearTimeout(id)
    }

    return clean
}

export function executeTaskRepeaterTask(self: TaskRepeater): undefined {
    const result = self.task()
    const promise = Promise.resolve(result)

    function onTaskCompletion() {
        self.clean = scheduleTaskRepeaterTask(self)
    }

    promise.then(onTaskCompletion, onTaskCompletion)
}

// Types ///////////////////////////////////////////////////////////////////////

export interface TaskRepeater {
    delay: number
    immediate: boolean
    running: boolean
    task(): undefined
    clean(): undefined
    start(): Task
    stop(): undefined
}

export interface TaskRepeaterOptions {
    immediate?: undefined | boolean
}

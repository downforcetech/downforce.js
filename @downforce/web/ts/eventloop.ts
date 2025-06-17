import {createCancelable} from '@downforce/std/cancel'
import type {Task} from '@downforce/std/fn'

export * from '@downforce/std/eventloop'

export function scheduleMicroTaskUsingMutationObserver(task: Task): Task {
    const [taskCancelable, cancelTask] = createCancelable(task)

    const observer = new MutationObserver(taskCancelable)
    const node = document.createTextNode('')
    observer.observe(node, {characterData: true})
    node.data = ''

    return cancelTask
}

let PostMessageInit = false
export let PostMessageId = '@downforce/web/eventloop.scheduleMacroTaskWithPostMessage()'
export const PostMessageQueue: Array<Task> = []

export function scheduleMacroTaskUsingPostMessage(task: Task): Task {
    const [taskCancelable, cancelTask] = createCancelable(task)

    if (! PostMessageInit) {
        PostMessageInit = true

        window.addEventListener(
            'message',
            event => {
                if (event.source !== window) {
                    return
                }
                if (event.data !== PostMessageId) {
                    return
                }

                event.stopImmediatePropagation()

                const selectedTask = PostMessageQueue.shift()
                selectedTask?.()
            },
            {capture: true, passive: true},
        )
    }

    PostMessageQueue.push(taskCancelable)
    window.postMessage(PostMessageId, '*')

    return cancelTask
}

export function scheduleMacroTaskUsingMessageChannel(task: Task): Task {
    const [taskCancelable, cancelTask] = createCancelable(task)

    const channel = new MessageChannel()
    channel.port1.onmessage = taskCancelable
    channel.port2.postMessage(0)

    return cancelTask
}

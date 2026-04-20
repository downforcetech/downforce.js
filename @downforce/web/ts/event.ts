import type {Task} from '@downforce/std/fn'
import type {Void} from '@downforce/std/type'

export function preventEventDefault(event: Pick<Event, 'preventDefault'>): undefined {
    event.preventDefault()
}

export function stopEventPropagation(event: Pick<Event, 'stopPropagation'>): undefined {
    event.stopPropagation()
}

export function stopEventPropagationImmediately(event: Pick<Event, 'stopImmediatePropagation'>): undefined {
    event.stopImmediatePropagation()
}

export function cancelEvent(event: Pick<Event, 'preventDefault' | 'stopPropagation'>): undefined {
    event.preventDefault()
    event.stopPropagation()
}

export function cancelEventImmediately(event: Pick<Event, 'preventDefault' | 'stopImmediatePropagation'>): undefined {
    event.preventDefault()
    event.stopImmediatePropagation()
}

export function observeEvent<K extends keyof AbortSignalEventMap>(
    emitter: AbortSignal,
    name: K,
    listener: (event: AbortSignalEventMap[K]) => Void,
    options?: undefined | AddEventListenerOptions,
): Task
export function observeEvent<K extends keyof EventSourceEventMap>(
    emitter: EventSource,
    name: K,
    listener: (event: EventSourceEventMap[K]) => Void,
    options?: undefined | AddEventListenerOptions,
): Task
export function observeEvent<K extends keyof FileReaderEventMap>(
    emitter: FileReader,
    name: K,
    listener: (event: FileReaderEventMap[K]) => Void,
    options?: undefined | AddEventListenerOptions,
): Task
export function observeEvent<K extends keyof FontFaceSetEventMap>(
    emitter: FontFaceSet,
    name: K,
    listener: (event: FontFaceSetEventMap[K]) => Void,
    options?: undefined | AddEventListenerOptions,
): Task
export function observeEvent<K extends keyof HTMLBodyElementEventMap>(
    emitter: HTMLBodyElement,
    name: K,
    listener: (event: HTMLBodyElementEventMap[K]) => Void,
    options?: undefined | AddEventListenerOptions,
): Task
export function observeEvent<K extends keyof HTMLElementEventMap>(
    emitter: HTMLAnchorElement,
    name: K,
    listener: (event: HTMLElementEventMap[K]) => Void,
    options?: undefined | AddEventListenerOptions,
): Task
export function observeEvent<K extends keyof HTMLElementEventMap>(
    emitter: HTMLAreaElement,
    name: K,
    listener: (event: HTMLElementEventMap[K]) => Void,
    options?: undefined | AddEventListenerOptions,
): Task
export function observeEvent<K extends keyof HTMLMediaElementEventMap>(
    emitter: HTMLAudioElement,
    name: K,
    listener: (event: HTMLMediaElementEventMap[K]) => Void,
    options?: undefined | AddEventListenerOptions,
): Task
export function observeEvent<K extends keyof ElementEventMap>(
    emitter: Element,
    name: K,
    listener: (event: ElementEventMap[K]) => Void,
    options?: undefined | AddEventListenerOptions,
): Task
export function observeEvent<K extends keyof GlobalEventHandlersEventMap>(
    emitter: GlobalEventHandlers,
    name: K,
    listener: (event: GlobalEventHandlersEventMap[K]) => Void,
    options?: undefined | AddEventListenerOptions,
): Task
export function observeEvent(
    emitter: EventTarget,
    name: string,
    listener: (event: Event) => Void,
    options?: undefined | AddEventListenerOptions,
): Task
export function observeEvent(
    emitter: EventTarget | GlobalEventHandlers,
    name: string,
    listener: (event: any) => Void,
    options?: boolean | AddEventListenerOptions,
): Task {
    emitter.addEventListener(name, listener, options)

    function clean(): undefined {
        emitter.removeEventListener(name, listener, options)
    }

    return clean
}

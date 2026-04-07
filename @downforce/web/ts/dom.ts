import type {Task} from '@downforce/std/fn'

export function addEventListener<K extends keyof AbortSignalEventMap>(emitter: AbortSignal, name: K, listener: (event: AbortSignalEventMap[K]) => undefined, options?: undefined | AddEventListenerOptions): Task
export function addEventListener<K extends keyof EventSourceEventMap>(emitter: EventSource, name: K, listener: (event: EventSourceEventMap[K]) => undefined, options?: undefined | AddEventListenerOptions): Task
export function addEventListener<K extends keyof FileReaderEventMap>(emitter: FileReader, name: K, listener: (event: FileReaderEventMap[K]) => undefined, options?: undefined | AddEventListenerOptions): Task
export function addEventListener<K extends keyof FontFaceSetEventMap>(emitter: FontFaceSet, name: K, listener: (event: FontFaceSetEventMap[K]) => undefined, options?: undefined | AddEventListenerOptions): Task
export function addEventListener<K extends keyof HTMLBodyElementEventMap>(emitter: HTMLBodyElement, name: K, listener: (event: HTMLBodyElementEventMap[K]) => undefined, options?: undefined | AddEventListenerOptions): Task
export function addEventListener<K extends keyof HTMLElementEventMap>(emitter: HTMLAnchorElement, name: K, listener: (event: HTMLElementEventMap[K]) => undefined, options?: undefined | AddEventListenerOptions): Task
export function addEventListener<K extends keyof HTMLElementEventMap>(emitter: HTMLAreaElement, name: K, listener: (event: HTMLElementEventMap[K]) => undefined, options?: undefined | AddEventListenerOptions): Task
export function addEventListener<K extends keyof HTMLMediaElementEventMap>(emitter: HTMLAudioElement, name: K, listener: (event: HTMLMediaElementEventMap[K]) => undefined, options?: undefined | AddEventListenerOptions): Task
export function addEventListener<K extends keyof ElementEventMap>(emitter: Element, name: K, listener: (event: ElementEventMap[K]) => undefined, options?: undefined | AddEventListenerOptions): Task
export function addEventListener<K extends keyof GlobalEventHandlersEventMap>(emitter: GlobalEventHandlers, name: K, listener: (event: GlobalEventHandlersEventMap[K]) => undefined, options?: undefined | AddEventListenerOptions): Task
export function addEventListener(emitter: EventTarget, name: string, listener: (evt: Event) => undefined, options?: undefined | AddEventListenerOptions): Task
export function addEventListener(
    emitter: EventTarget | GlobalEventHandlers,
    name: string,
    listener: (event: any) => undefined,
    options?: boolean | AddEventListenerOptions,
): Task {
    emitter.addEventListener(name, listener, options)

    function clean(): undefined {
        emitter.removeEventListener(name, listener, options)
    }

    return clean
}

export function removeChildren(element: Element): undefined {
    while (element.lastChild) {
        element.lastChild.remove()
    }
}

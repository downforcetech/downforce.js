import type {Task} from '@downforce/std/fn'

export class WebElement extends HTMLElement {
    #hooksState: WebElementHooksState = {
        mounted: [],
        unmounted: [],
    }

    // constructor() {
    //     super()
    // }

    connectedCallback(): void {
        this.#hooksState.mounted.forEach(task => task())
    }

    disconnectedCallback(): void {
        this.#hooksState.unmounted.forEach(task => task())

        this.#hooksState.unmounted = []
    }

    getHooksState(): WebElementHooksState {
        return this.#hooksState
    }
}

// Hooks ///////////////////////////////////////////////////////////////////////

export function useMounted(element: WebElement, effect: Task<void | Task<void>>): void {
    const unmountedEffect = effect()

    if (unmountedEffect) {
        element.getHooksState().unmounted.push(unmountedEffect)
    }
}

export function useUnmounted(element: WebElement, effect: Task<void>): void {
    useMounted(element, () => effect)
}

export function useEventListener<T extends keyof WindowEventMap>(a: WebElement, b: Window, c: T, d: (e: WindowEventMap[T]) => any, e?: boolean | AddEventListenerOptions): void
export function useEventListener<T extends keyof DocumentEventMap>(a: WebElement, b: Document, c: T, d: (e: DocumentEventMap[T]) => any, e?: boolean | AddEventListenerOptions): void
export function useEventListener<T extends keyof HTMLElementEventMap>(a: WebElement, b: HTMLElement, c: T, d: (e: HTMLElementEventMap[T]) => any, e?: boolean | AddEventListenerOptions): void
export function useEventListener<T extends keyof SVGElementEventMap>(a: WebElement, b: SVGElement, c: T, d: (e: SVGElementEventMap[T]) => any, e?: boolean | AddEventListenerOptions): void
export function useEventListener(a: WebElement, b: Element, c: string, d: EventListener, e?: boolean | AddEventListenerOptions): void
export function useEventListener(element: WebElement, target: Window | Document | Element, type: string, listener: EventListener, options?: boolean | AddEventListenerOptions): void {
    useMounted(element, () => {
        target.addEventListener(type, listener, options)

        function onUnmount() {
            target.removeEventListener(type, listener, options)
        }

        return onUnmount
    })
}

// Types ///////////////////////////////////////////////////////////////////////

export interface WebElementHooksState {
    mounted: Array<Function>
    unmounted: Array<Function>
}

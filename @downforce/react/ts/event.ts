import {arrayWrap} from '@downforce/std/array'
import {debounced, throttled, type EventTask} from '@downforce/std/event'
import type {Fn, FnArgs, Task} from '@downforce/std/fn'
import type {None} from '@downforce/std/optional'
import {useCallback, useEffect, useLayoutEffect, useMemo, useRef} from 'react'
import {useStateTransition, type StateAccessorManager, type StateInit} from './state.js'

export function useEvent<E extends Event>(
    targetRefOrRefs: React.RefObject<None | EventElement> | Array<React.RefObject<None | EventElement>>,
    eventName: string,
    onEventHandler: EventHandler<E>,
    options?: undefined | EventOptions,
): void {
    const active = options?.active ?? true
    const capture = options?.phase === 'capturing' // Bubbling by default.
    const passive = options?.passive ?? true

    useEffect(() => {
        if (! active) {
            return
        }

        const targetsRefs = arrayWrap(targetRefOrRefs)
        const eventOptions: AddEventListenerOptions = {capture: capture, passive: passive}

        targetsRefs.forEach(ref => {
            ref.current?.addEventListener(eventName, onEventHandler as EventListener, eventOptions)
        })

        function onClean() {
            targetsRefs.forEach(ref => {
                ref.current?.removeEventListener(eventName, onEventHandler as EventListener, eventOptions.capture)
            })
        }

        return onClean
    }, [active, eventName, capture, passive, onEventHandler])
}

export function useCallbackDebounced<A extends FnArgs>(callback: Fn<A>, delayMs: number): EventTask<A> {
    const callbackDebounced = useMemo(() => {
        return debounced(callback, delayMs)
    }, [callback, delayMs])

    useEffect(() => {
        function onClean() {
            callbackDebounced.cancel()
        }

        return onClean
    }, [callbackDebounced])

    return callbackDebounced
}

export function useCallbackThrottled<A extends FnArgs>(callback: Fn<A>, delayMs: number): EventTask<A> {
    const callbackThrottled = useMemo(() => {
        return throttled(callback, delayMs)
    }, [callback, delayMs])

    useEffect(() => {
        function onClean() {
            callbackThrottled.cancel()
        }

        return onClean
    }, [callbackThrottled])

    return callbackThrottled
}

export function useCallbackDelayed(callback: Function, delayMs: number): {run: Task, cancel: Task} {
    const taskRef = useRef<ReturnType<typeof setTimeout>>(undefined)

    const cancel = useCallback(() => {
        if (! taskRef.current) {
            return
        }

        taskRef.current = void clearTimeout(taskRef.current)
    }, [])

    const run = useCallback(() => {
        cancel()

        taskRef.current = setTimeout(callback, delayMs)
    }, [callback, cancel])

    useLayoutEffect(() => {
        // We use useLayoutEffect() to conform with React 17 hooks lifecycle.
        return cancel
    }, [cancel])

    return {run, cancel}
}

export function useStateDebounced<T>(initialValue: undefined, delay: number): StateAccessorManager<undefined | T>
export function useStateDebounced<T>(initialValue: StateInit<T>, delay: number): StateAccessorManager<T>
export function useStateDebounced<T>(initialValue: undefined | T, delay: number): StateAccessorManager<undefined | T> {
    const [value, setValue, getValue] = useStateTransition(initialValue)
    const setValueDebounced = useCallbackDebounced(setValue, delay)

    return [value, setValueDebounced, getValue]
}

export function useStateThrottled<T>(initialValue: undefined, delay: number): StateAccessorManager<undefined | T>
export function useStateThrottled<T>(initialValue: StateInit<T>, delay: number): StateAccessorManager<T>
export function useStateThrottled<T>(initialValue: undefined | StateInit<T>, delay: number): StateAccessorManager<undefined | T> {
    const [value, setValue, getValue] = useStateTransition(initialValue)
    const setValueThrottled = useCallbackThrottled(setValue, delay)

    return [value, setValueThrottled, getValue]
}

export function useValueDebounced<V>(input: V, delay: number): V {
    const [output, setOutput] = useStateTransition(input)

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setOutput(input)
        }, delay)

        function onClean() {
            clearTimeout(timeoutId)
        }

        return onClean
    }, [input])

    return output
}

// Types ///////////////////////////////////////////////////////////////////////

export interface EventOptions {
    active?: undefined | boolean
    passive?: undefined | boolean
    phase?: undefined |  'bubbling' | 'capturing'
}

export type EventElement = Element | EventTarget
export type EventHandler<E> = (event: E) => void

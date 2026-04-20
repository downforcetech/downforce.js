import {arrayWrap} from '@downforce/std/array'
import {debounced, throttled, type EventTask} from '@downforce/std/event'
import {call, noop, type Fn, type FnArgs, type Task} from '@downforce/std/fn'
import type {None} from '@downforce/std/optional'
import type {Void} from '@downforce/std/type'
import {observeEvent} from '@downforce/web/event'
import {startTransition, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react'
import {useStateAccessor, type StateAccessorManager, type StateInit} from './state.js'

export function useEvent<E extends Event>(
    targetRefOrRefs: React.RefObject<None | EventElement> | Array<React.RefObject<None | EventElement>>,
    eventName: string,
    onEvent: EventHandler<E>,
    options?: undefined | UseEventOptions,
    deps?: undefined | Array<unknown>,
): undefined {
    const onEventMemoized = deps ? useCallback(onEvent, deps) : onEvent
    const active = options?.active ?? true
    const capture = options?.phase === 'capturing' // Bubbling by default.
    const passive = options?.passive ?? true

    useEffect(() => {
        if (! active) {
            return
        }

        const targetsRefs = arrayWrap(targetRefOrRefs)
        const eventOptions: AddEventListenerOptions = {capture: capture, passive: passive}

        const cleanups = targetsRefs.map((ref): Task =>
            ref.current
                ? observeEvent(ref.current, eventName, onEventMemoized as EventListener, eventOptions)
                : noop
        )

        function onClean() {
            cleanups.forEach(call)
        }

        return onClean
    }, [onEventMemoized, active, eventName, capture, passive])
}

export function useCallbackDebounced<A extends FnArgs>(
    callback: Fn<A>,
    delayMs: number,
    deps?: undefined | Array<unknown>,
): EventTask<A> {
    const callbackMemoized = deps ? useCallback(callback, deps) : callback

    const callbackDebounced = useMemo(() => {
        return debounced(callbackMemoized, delayMs)
    }, [callbackMemoized, delayMs])

    useEffect(() => {
        function onClean() {
            callbackDebounced.cancel()
        }

        return onClean
    }, [callbackDebounced])

    return callbackDebounced
}

export function useCallbackThrottled<A extends FnArgs>(
    callback: Fn<A>,
    delayMs: number,
    deps?: undefined | Array<unknown>,
): EventTask<A> {
    const callbackMemoized = deps ? useCallback(callback, deps) : callback

    const callbackThrottled = useMemo(() => {
        return throttled(callbackMemoized, delayMs)
    }, [callbackMemoized, delayMs])

    useEffect(() => {
        function onClean() {
            callbackThrottled.cancel()
        }

        return onClean
    }, [callbackThrottled])

    return callbackThrottled
}

export function useCallbackDelayed<A extends FnArgs>(
    callback: Fn<A>,
    delayMs: number,
    deps?: undefined | Array<unknown>,
): {
    (...args: A): undefined
    cancel: Task
} {
    const callbackMemoized = deps ? useCallback(callback, deps) : callback
    const taskRef = useRef<ReturnType<typeof setTimeout>>(undefined)

    const cancel = useCallback((): undefined => {
        if (! taskRef.current) {
            return
        }

        taskRef.current = void clearTimeout(taskRef.current)
    }, [])

    const callbackDelayed = useCallback((...args: A): undefined => {
        cancel()

        taskRef.current = setTimeout(callbackMemoized, delayMs, ...args)
    }, [callbackMemoized, cancel])

    useLayoutEffect(() => {
        // We use useLayoutEffect() to conform with React 17 hooks lifecycle.
        return cancel
    }, [cancel])

    type Return = (typeof callbackDelayed) & {cancel: Task}

    (callbackDelayed as Return).cancel = cancel

    return callbackDelayed as Return
}

export function useStateDebounced<T>(initialValue: undefined, delay: number): StateAccessorManager<undefined | T>
export function useStateDebounced<T>(initialValue: StateInit<T>, delay: number): StateAccessorManager<T>
export function useStateDebounced<T>(initialValue: undefined | T, delay: number): StateAccessorManager<undefined | T> {
    const [value, setValue, getValue] = useStateAccessor(initialValue)
    const setValueDebounced = useCallbackDebounced(setValue, delay)

    return [value, setValueDebounced, getValue]
}

export function useStateThrottled<T>(initialValue: undefined, delay: number): StateAccessorManager<undefined | T>
export function useStateThrottled<T>(initialValue: StateInit<T>, delay: number): StateAccessorManager<T>
export function useStateThrottled<T>(initialValue: undefined | StateInit<T>, delay: number): StateAccessorManager<undefined | T> {
    const [value, setValue, getValue] = useStateAccessor(initialValue)
    const setValueThrottled = useCallbackThrottled(setValue, delay)

    return [value, setValueThrottled, getValue]
}

export function useValueDebounced<V>(input: V, delay: number): V {
    const [output, setOutput] = useState(input)

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            startTransition(() => {
                setOutput(input)
            })
        }, delay)

        function onClean() {
            clearTimeout(timeoutId)
        }

        return onClean
    }, [input])

    return output
}

// Types ///////////////////////////////////////////////////////////////////////

export interface UseEventOptions {
    active?: undefined | boolean
    passive?: undefined | boolean
    phase?: undefined |  'bubbling' | 'capturing'
}

export type EventElement = Element | EventTarget
export type EventHandler<E> = (event: E) => Void

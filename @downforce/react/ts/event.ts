import {arrayWrap} from '@downforce/std/array'
import {debounced, throttled, type EventTask} from '@downforce/std/event'
import {call, noop, type Fn, type FnArgs, type Task} from '@downforce/std/fn'
import type {None} from '@downforce/std/optional'
import type {Void} from '@downforce/std/type'
import {observeEvent} from '@downforce/web/event'
import {startTransition, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react'
import {useFn, type HookDeps} from './hook.js'
import {useState3, type UseState3Contract, type StateInit} from './state.js'

export function useEvent<E extends Event>(
    targetRefOrRefs: React.RefObject<None | EventElement> | Array<React.RefObject<None | EventElement>>,
    eventName: string,
    onEvent: EventHandler<E>,
    deps?: undefined | HookDeps,
    options?: undefined | UseEventOptions,
): undefined {
    const onEventMemoized = useFn(onEvent, deps)
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
    }, [eventName, onEventMemoized, active, capture, passive])
}

export function useCallbackDebounced<A extends FnArgs>(
    delayMs: number,
    onCall: Fn<A>,
    deps?: undefined | HookDeps,
): EventTask<A> {
    const onCallMemoized = useFn(onCall, deps)

    const callbackDebounced = useMemo(() => {
        return debounced(onCallMemoized, delayMs)
    }, [onCallMemoized, delayMs])

    useEffect(() => {
        function onClean() {
            callbackDebounced.cancel()
        }

        return onClean
    }, [callbackDebounced])

    return callbackDebounced
}

export function useCallbackThrottled<A extends FnArgs>(
    delayMs: number,
    onCall: Fn<A>,
    deps?: undefined | HookDeps,
): EventTask<A> {
    const onCallMemoized = useFn(onCall, deps)

    const callbackThrottled = useMemo(() => {
        return throttled(onCallMemoized, delayMs)
    }, [onCallMemoized, delayMs])

    useEffect(() => {
        function onClean() {
            callbackThrottled.cancel()
        }

        return onClean
    }, [callbackThrottled])

    return callbackThrottled
}

export function useCallbackDelayed<A extends FnArgs>(
    delayMs: number,
    onCall: Fn<A>,
    deps?: undefined | HookDeps,
): {
    (...args: A): undefined
    cancel: Task
} {
    const onCallMemoized = useFn(onCall, deps)
    const taskRef = useRef<ReturnType<typeof setTimeout>>(undefined)

    const cancel = useCallback((): undefined => {
        if (! taskRef.current) {
            return
        }

        taskRef.current = void clearTimeout(taskRef.current)
    }, [])

    const callbackDelayed = useCallback((...args: A): undefined => {
        cancel()

        taskRef.current = setTimeout(onCallMemoized, delayMs, ...args)
    }, [onCallMemoized, cancel])

    useLayoutEffect(() => {
        // We use useLayoutEffect() to conform with React 17 hooks lifecycle.
        return cancel
    }, [cancel])

    type Return = (typeof callbackDelayed) & {cancel: Task}

    (callbackDelayed as Return).cancel = cancel

    return callbackDelayed as Return
}

export function useStateDebounced<T>(
    initialValue: undefined,
    delay: number,
): UseState3Contract<undefined | T>
export function useStateDebounced<T>(
    initialValue: StateInit<T>,
    delay: number,
): UseState3Contract<T>
export function useStateDebounced<T>(
    initialValue: undefined | T,
    delay: number,
): UseState3Contract<undefined | T> {
    const [value, setValue, getValue] = useState3(initialValue)
    const setValueDebounced = useCallbackDebounced(delay, setValue)

    return [value, setValueDebounced, getValue]
}

export function useStateThrottled<T>(
    initialValue: undefined,
    delay: number,
): UseState3Contract<undefined | T>
export function useStateThrottled<T>(
    initialValue: StateInit<T>,
    delay: number,
): UseState3Contract<T>
export function useStateThrottled<T>(
    initialValue: undefined | StateInit<T>,
    delay: number,
): UseState3Contract<undefined | T> {
    const [value, setValue, getValue] = useState3(initialValue)
    const setValueThrottled = useCallbackThrottled(delay, setValue)

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

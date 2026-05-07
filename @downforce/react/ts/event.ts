import {arrayWrap} from '@downforce/std/array'
import {call, noop, type Task} from '@downforce/std/fn'
import {isSome, type None} from '@downforce/std/optional'
import type {Void} from '@downforce/std/type'
import {observeEvent} from '@downforce/web/event'
import {useEffect, useRef} from 'react'
import {useCallback2, type HookDeps} from './memo.js'

export function useEvent<E extends Event>(
    targetRefOrRefs: React.RefObject<None | EventElement> | Array<React.RefObject<None | EventElement>>,
    eventName: string,
    onEvent: EventHandler<E>,
    deps?: undefined | HookDeps,
    options?: undefined | UseEventOptions,
): undefined {
    const onEventMemoized = useCallback2(onEvent, deps)
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

export function useEventOutside<E extends Event>(
    refOrRefs: React.RefObject<None | Element> | Array<React.RefObject<None | Element>>,
    eventName: string,
    onEvent: EventHandler<E>,
    deps?: undefined | HookDeps,
    options?: undefined | UseEventOutsideOptions,
): undefined {
    const onEventMemoized = useCallback2(onEvent, deps)
    const documentRef = useRef<EventElement>(document.documentElement)
    const behavior = options?.behavior ?? 'every'
    const rootRef = options?.rootRef ?? documentRef

    useEvent(
        rootRef,
        eventName,
        (event: E) => {
            const eventTarget = event.target as null | Node
            const refs = arrayWrap(refOrRefs)

            if (! eventTarget) {
                onEventMemoized(event)
                return
            }

            const refsContainEvent = refs.map(ref => {
                return ref.current?.contains(eventTarget)
            }).filter(isSome)

            const eventIsOutside = call(() => {
                switch (behavior) {
                    // Event can be outside any ref to be considered outside.
                    case 'any': return refsContainEvent.some(it => it === false)
                    // Event must be outside every ref to be considered outside.
                    case 'every': return refsContainEvent.every(it => it === false)
                }
            })

            if (eventIsOutside) {
                onEventMemoized(event)
            }
        },
        [onEventMemoized, behavior],
        options,
    )
}

// Types ///////////////////////////////////////////////////////////////////////

export interface UseEventOptions {
    active?: undefined | boolean
    passive?: undefined | boolean
    phase?: undefined |  'bubbling' | 'capturing'
}

export interface UseEventOutsideOptions extends UseEventOptions {
    behavior?: undefined | 'any' | 'every'
    rootRef?: undefined | React.RefObject<None | EventElement>
}

export type EventElement = Element | EventTarget
export type EventHandler<E> = (event: E) => Void

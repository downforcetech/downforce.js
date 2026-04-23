import {arrayWrap} from '@downforce/std/array'
import {call} from '@downforce/std/fn'
import {isSome, type None} from '@downforce/std/optional'
import {useCallback, useRef} from 'react'
import {useEvent, type EventElement, type EventHandler, type UseEventOptions} from './event.js'
import {NoDeps, type HookDeps} from './hook.js'

export function useEventOutside<E extends Event>(
    refOrRefs: React.RefObject<None | Element> | Array<React.RefObject<None | Element>>,
    eventName: string,
    onEventCallback: EventHandler<E>,
    options?: undefined | UseEventOutsideOptions,
    deps?: undefined | HookDeps,
): undefined {
    const onEventMemoized = useCallback(onEventCallback, deps ?? NoDeps)
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
        options,
        [onEventMemoized, behavior]
    )
}

export function useClickOutside(
    refOrRefs: React.RefObject<None | Element> | Array<React.RefObject<None | Element>>,
    onEventCallback: EventHandler<MouseEvent>,
    options?: undefined | UseClickOutsideOptions,
    deps?: undefined | HookDeps,
): undefined {
    const event = options?.event ?? 'click'

    useEventOutside(refOrRefs, event, onEventCallback, options, deps)
}

// Types ///////////////////////////////////////////////////////////////////////

export interface UseEventOutsideOptions extends UseEventOptions {
    behavior?: undefined | 'any' | 'every'
    rootRef?: undefined | React.RefObject<None | EventElement>
}

export interface UseClickOutsideOptions extends UseEventOutsideOptions {
    event?: undefined | 'click' | 'mousedown' | 'mouseup'
}

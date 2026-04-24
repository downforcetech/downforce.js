import {arrayWrap} from '@downforce/std/array'
import {call} from '@downforce/std/fn'
import {isSome, type None} from '@downforce/std/optional'
import {useRef} from 'react'
import {useEvent, type EventElement, type EventHandler, type UseEventOptions} from './event.js'
import {useFn, type HookDeps} from './hook.js'

export function useEventOutside<E extends Event>(
    refOrRefs: React.RefObject<None | Element> | Array<React.RefObject<None | Element>>,
    eventName: string,
    onEvent: EventHandler<E>,
    deps?: undefined | HookDeps,
    options?: undefined | UseEventOutsideOptions,
): undefined {
    const onEventMemoized = useFn(onEvent, deps)
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

export function useClickOutside(
    refOrRefs: React.RefObject<None | Element> | Array<React.RefObject<None | Element>>,
    onEvent: EventHandler<MouseEvent>,
    deps?: undefined | HookDeps,
    options?: undefined | UseClickOutsideOptions,
): undefined {
    const event = options?.event ?? 'click'

    useEventOutside(refOrRefs, event, onEvent, deps, options)
}

// Types ///////////////////////////////////////////////////////////////////////

export interface UseEventOutsideOptions extends UseEventOptions {
    behavior?: undefined | 'any' | 'every'
    rootRef?: undefined | React.RefObject<None | EventElement>
}

export interface UseClickOutsideOptions extends UseEventOutsideOptions {
    event?: undefined | 'click' | 'mousedown' | 'mouseup'
}

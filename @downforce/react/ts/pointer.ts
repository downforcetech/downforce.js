import {type None} from '@downforce/std/optional'
import {useEventOutside, type EventHandler, type UseEventOutsideOptions} from './event.js'
import {type HookDeps} from './memo.js'

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

export interface UseClickOutsideOptions extends UseEventOutsideOptions {
    event?: undefined | 'click' | 'mousedown' | 'mouseup'
}

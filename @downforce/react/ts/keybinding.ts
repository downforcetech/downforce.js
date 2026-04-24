import {arrayWrap} from '@downforce/std/array'
import type {None} from '@downforce/std/optional'
import {useRef} from 'react'
import {useEvent, type EventElement, type EventHandler, type UseEventOptions} from './event.js'
import {useFn, type HookDeps} from './hook.js'

export function useKey(
    key: KeybindingKey,
    onKey: EventHandler<KeyboardEvent>,
    deps?: undefined | HookDeps,
    options?: undefined | UseKeyOptions,
): undefined {
    const onKeyMemoized = useFn(onKey, deps)
    const documentRef = useRef(document)
    const event = options?.event ?? 'keydown'
    const ref = options?.ref ?? documentRef

    useEvent(
        ref,
        event,
        (event: KeyboardEvent) => {
            const keys = arrayWrap(key)
            const isTheKey = keys.includes(event.key)

            if (! isTheKey) {
                return
            }

            onKeyMemoized(event)
        },
        [key, onKeyMemoized],
        options,
    )
}

// Types ///////////////////////////////////////////////////////////////////////

export type KeybindingKey = string | Array<string> // https://developer.mozilla.org/it/docs/Web/API/KeyboardEvent/key/Key_Values

export interface UseKeyOptions extends UseEventOptions {
    event?: undefined | 'keyup' | 'keydown'
    ref?: undefined | React.RefObject<None | EventElement> | Array<React.RefObject<None | EventElement>>
}

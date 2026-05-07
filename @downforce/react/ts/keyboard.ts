import {arrayWrap} from '@downforce/std/array'
import type {UnionOf} from '@downforce/std/enum'
import type {None} from '@downforce/std/optional'
import type {StringAutocomplete} from '@downforce/std/type'
import {KeyboardKey} from '@downforce/web/keyboard'
import {useRef} from 'react'
import {useEvent, type EventElement, type EventHandler, type UseEventOptions} from './event.js'
import {useCallback2, type HookDeps} from './memo.js'

export function useKey(
    key: KeyboardKeyType | Array<KeyboardKeyType>,
    onKey: EventHandler<KeyboardEvent>,
    deps?: undefined | HookDeps,
    options?: undefined | UseKeyOptions,
): undefined {
    const onKeyMemoized = useCallback2(onKey, deps)
    const documentRef = useRef(document)
    const event = options?.event ?? 'keydown'
    const ref = options?.ref ?? documentRef

    useEvent(
        ref,
        event,
        (event: KeyboardEvent) => {
            const keys = arrayWrap(key)
            const keyDoesMatch = keys.includes(event.key)

            if (! keyDoesMatch) {
                return
            }

            onKeyMemoized(event)
        },
        [key, onKeyMemoized],
        options,
    )
}

// Types ///////////////////////////////////////////////////////////////////////

export type KeyboardKeyType = UnionOf<typeof KeyboardKey> | StringAutocomplete // https://developer.mozilla.org/it/docs/Web/API/KeyboardEvent/key/Key_Values

export interface UseKeyOptions extends UseEventOptions {
    event?: undefined | 'keyup' | 'keydown'
    ref?: undefined | React.RefObject<None | EventElement> | Array<React.RefObject<None | EventElement>>
}

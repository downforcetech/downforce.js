import {strictIntegerLike} from '@downforce/std/number'
import type {FIX, Void} from '@downforce/std/type'
import {observeEvent} from '@downforce/web/event'
import {useEffect} from 'react'
import {useCallback2, type HookDeps} from './memo.js'

export function usePageScroll(
    onScroll: (element: HTMLElement) => Void,
    deps?: undefined | HookDeps,
): undefined {
    const onScrollMemoized = useCallback2(onScroll, deps)

    useEffect(() => {
        function onPageScroll(event: Event) {
            if (event.target !== event.currentTarget) {
                return
            }

            onScrollMemoized(document.scrollingElement as HTMLElement)
        }

        const onClean = observeEvent(document, 'scroll', onPageScroll, {passive: true})

        return onClean as FIX<void | (() => void)>
    }, [onScrollMemoized])
}

// Import `@downforce/std.css/modal.classes.css`.
export function usePageScrollLock(activeOptional?: undefined | boolean): undefined {
    const active = activeOptional ?? true

    useEffect(() => {
        if (! active) {
            return
        }

        lockPageScroll()

        function onClean() {
            unlockPageScroll()
        }

        return onClean
    }, [active])
}

export function lockPageScroll(): undefined {
    const locks = strictIntegerLike(document.scrollingElement?.getAttribute('no-scroll') ?? '') ?? 0

    document.scrollingElement?.setAttribute('no-scroll', String(locks + 1))
}

export function unlockPageScroll(): undefined {
    const locks = strictIntegerLike(document.scrollingElement?.getAttribute('no-scroll') ?? '') ?? 0

    if (locks > 1) {
        document.scrollingElement?.setAttribute('no-scroll', String(locks - 1))
    }
    else {
        document.scrollingElement?.removeAttribute('no-scroll')
    }
}

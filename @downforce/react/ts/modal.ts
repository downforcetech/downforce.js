// See `@downforce/std.css/modal.classes.css`.

import {asInteger} from '@downforce/std/type-as'
import {useEffect} from 'react'

export function useScrollLock(activeOptional?: undefined | boolean): void {
    const active = activeOptional ?? true

    useEffect(() => {
        if (! active) {
            return
        }

        lockScroll()

        function onClean() {
            unlockScroll()
        }

        return onClean
    }, [active])
}

export function lockScroll(): void {
    const locks = asInteger(document.scrollingElement?.getAttribute('no-scroll') ?? '') ?? 0

    document.scrollingElement?.setAttribute('no-scroll', String(locks + 1))
}

export function unlockScroll(): void {
    const locks = asInteger(document.scrollingElement?.getAttribute('no-scroll') ?? '') ?? 0

    if (locks > 1) {
        document.scrollingElement?.setAttribute('no-scroll', String(locks - 1))
    }
    else {
        document.scrollingElement?.removeAttribute('no-scroll')
    }
}

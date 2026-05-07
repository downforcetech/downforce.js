import type {None} from '@downforce/std/optional'
import type {FIX} from '@downforce/std/type'
import {hasBrowserTouch} from '@downforce/web/browser'
import {observeEvent} from '@downforce/web/event'
import {startTransition, useEffect, useRef, useState} from 'react'
import {useCallbackDebounced} from './defer.js'
import {NoDeps} from './memo.js'

export function useBrowserFeatures(): BrowserFeatures {
    const [features, setFeatures] = useState(listBrowserFeatures)

    const setFeaturesDebounced = useCallbackDebounced(
        100,
        () => {
            startTransition(() => {
                setFeatures(listBrowserFeatures())
            })
        },
        NoDeps,
    )

    useEffect(() => {
        // Supports DevTools switching between desktop and mobile inspectors.
        const onClean = observeEvent(window, 'resize', setFeaturesDebounced)

        return onClean as FIX<void | (() => void)>
    }, [])

    return features
}

export function useBrowserFeaturesClassesProvider(options?: undefined | {
    elementRef?: undefined | React.RefObject<None | HTMLElement>
    active?: undefined | boolean,
}): undefined {
    const documentRef = useRef(document.documentElement)
    const features = useBrowserFeatures()
    const ref = options?.elementRef ?? documentRef
    const active = options?.active ?? true

    useEffect(() => {
        if (! active) {
            return
        }

        const featuresMap = {
            'has-touch': features.touch,
        }

        const allClasses = Object.keys(featuresMap)
        const activeClasses = Object.entries(featuresMap)
            .filter(([className, active]) => active)
            .map(([className]) => className)

        ref.current?.classList.remove(...allClasses)
        ref.current?.classList.add(...activeClasses)
    }, [features, active])
}

export function listBrowserFeatures(): BrowserFeatures {
    return {
        touch: hasBrowserTouch(),
    }
}

// Types ///////////////////////////////////////////////////////////////////////

interface BrowserFeatures {
    touch: boolean
}

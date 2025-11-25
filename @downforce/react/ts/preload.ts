import {exposePreloadHintElement, type PreloadElementAttrs, type PreloadElementOptions} from '@downforce/web/preload'
import {useEffect} from 'react'

export type {PreloadElementAttrs} from '@downforce/web/preload'

export function usePreloadHint(attrs: PreloadElementAttrs, options?: undefined | UsePreloadHintOptions): void {
    const active = options?.active ?? true

    useEffect(() => {
        if (! active) {
            return
        }

        exposePreloadHintElement(attrs, options)
    }, [active])
}

// Types ///////////////////////////////////////////////////////////////////////

export interface UsePreloadHintOptions extends PreloadElementOptions {
    active?: undefined | boolean
}

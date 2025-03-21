import {exposePreloadHintElement, type PreloadElementAttrs, type PreloadElementOptions} from '@downforce/web/preload'
import {useConditionalEffect} from './effect.js'

export type {PreloadElementAttrs} from '@downforce/web/preload'

export function usePreloadHint(attrs: PreloadElementAttrs, options?: undefined | UsePreloadHintOptions): void {
    const active = options?.active ?? true

    useConditionalEffect(active, () => {
        exposePreloadHintElement(attrs, options)
    })
}

// Types ///////////////////////////////////////////////////////////////////////

export interface UsePreloadHintOptions extends PreloadElementOptions {
    active?: undefined | boolean
}

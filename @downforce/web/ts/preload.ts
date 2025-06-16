import type {Fn} from '@downforce/std/fn'
import {whenSome} from '@downforce/std/optional'
import type {StringAutocompleted} from '@downforce/std/type'
import type {JsonType, TextType} from './mimetype.js'

export function exposePreloadHintElement(attrs: PreloadElementAttrs, options?: undefined | PreloadElementOptions): Node {
    const hintElement = findPreloadHint(attrs)

    if (hintElement) {
        return hintElement
    }

    const element = createPreloadHintElement(attrs)
    attachPreloadHintElement(element, options)
    return element
}

export function createPreloadHintElement(attrs: PreloadElementAttrs): HTMLLinkElement {
    const element = document.createElement('link')
    whenSome(attrs.as, it => element.setAttribute('as', it))
    whenSome(attrs.crossOrigin, it => element.setAttribute('crossOrigin', it))
    whenSome(attrs.fetchPriority, it => element.setAttribute('fetchPriority', it))
    whenSome(attrs.href, it => element.setAttribute('href', it))
    whenSome(attrs.rel, it => element.setAttribute('rel', it))
    whenSome(attrs.type, it => element.setAttribute('type', it))
    return element
}

export function findPreloadHint(attrs: PreloadElementAttrs): undefined | HTMLLinkElement {
    const selector = [
        'link',
        attrs.as ? `[as="${attrs.as}"]` : undefined,
        attrs.crossOrigin ? `[crossOrigin="${attrs.crossOrigin}"]` : undefined,
        attrs.fetchPriority ? `[fetchPriority="${attrs.fetchPriority}"]` : undefined,
        `[href="${attrs.href}"]`,
        `[rel="${attrs.rel}"]`,
        attrs.type ? `[type="${attrs.type}"]` : undefined,
    ].filter(Boolean).join('')

    return document.querySelector<HTMLLinkElement>(selector) ?? undefined
}

export function attachPreloadHintElement(element: Node, options?: undefined | PreloadElementOptions): void {
    const attach = options?.attach ?? attachToHeadPrepending
    attach(element)
}

export function attachToHeadAppending(element: Node): void {
    document.head.append(element)
}

export function attachToHeadPrepending(element: Node): void {
    document.head.prepend(element)
}

// Types ///////////////////////////////////////////////////////////////////////

export interface PreloadElementAttrs {
    as?: undefined | 'fetch' | 'font' | StringAutocompleted // Extend it as needed.
    crossOrigin?: undefined | 'anonymous' | 'use-credentials'
    fetchPriority?: undefined | 'auto' | 'low' | 'high'
    href: string
    rel: 'dns-prefetch' | 'preconnect' | 'prefetch' | 'preload'
    type?: undefined
        | typeof JsonType
        | typeof TextType
        | 'font/woff'
        | 'font/woff2'
        | StringAutocompleted
}

export interface PreloadElementOptions {
    attach?: undefined | Fn<[element: Node], void>
}

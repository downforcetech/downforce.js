import {isArray} from '@downforce/std/array'
import {isObject, omitObjectPropsUndefined} from '@downforce/std/object'
import type {None} from '@downforce/std/optional'

export function mergeRequestHeaders(...headersList: Array<None | RequestHeadersInit>): Record<string, string> {
    return omitObjectPropsUndefined(
        mergeRequestHeadersPartial(...headersList),
    ) as Record<string, string>
}

export function mergeRequestHeadersPartial(...headersList: Array<None | RequestHeadersInit>): Record<string, undefined | string> {
    const headersMap: Record<string, undefined | string> = {}

    for (const headers of headersList) {
        if (headers instanceof Headers) {
            for (const it of headers.entries()) {
                const [key, value] = it
                headersMap[key] = value
            }
        }
        else if (isArray(headers)) {
            for (const it of headers) {
                const [key, value] = it
                headersMap[key] = value
            }
        }
        else if (isObject(headers)) {
            Object.assign(headersMap, headers)
        }
    }

    return headersMap
}

// Types ///////////////////////////////////////////////////////////////////////

export type RequestHeadersInit = HeadersInit | Array<[string, undefined | string]> | Record<string, undefined | string>

import {isArray} from '@downforce/std/array'
import {throwInvalidArgument} from '@downforce/std/error'
import {isObject, omitObjectPropsUndefined} from '@downforce/std/object'
import {isNone, type None} from '@downforce/std/optional'

/**
* @throws InvalidArgument
**/
export function mergeRequestHeaders(...headersList: Array<None | RequestHeadersInit>): Record<string, string> {
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
        else if (isNone(headers)) {
        }
        else {
            return throwInvalidArgument(
                '@downforce/web/request.mergeRequestHeaders(...list: Array<HeadersInit>):\n'
                + `HeadersInit must be undefined | null | Object | Array | Headers, given "${headers}".`
            )
        }
    }

    return omitObjectPropsUndefined(headersMap) as Record<string, string>
}

// Types ///////////////////////////////////////////////////////////////////////

export type RequestHeadersInit = HeadersInit | Array<[string, undefined | string]> | Record<string, undefined | string>

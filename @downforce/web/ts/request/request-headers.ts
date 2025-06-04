import {isArray} from '@downforce/std/array'
import {throwInvalidArgument} from '@downforce/std/error'
import {isObject} from '@downforce/std/object'
import {isNone} from '@downforce/std/optional'

/**
* @throws InvalidArgument
**/
export function mergeRequestHeaders(...headersList: Array<HeadersInit>): Record<string, string> {
    const headersMap: Record<string, string> = {}

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
                '@downforce/web/request-headers.mergeRequestHeaders(...list: Array<headers>):\n'
                + `headers must be undefined | null | Object | Array | Headers, given "${headers}".`
            )
        }
    }

    return headersMap satisfies HeadersInit
}

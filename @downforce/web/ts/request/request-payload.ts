import type {Io} from '@downforce/std/fn'
import {isDefined} from '@downforce/std/optional'
import {isString} from '@downforce/std/string'
import {setupRequestBody} from './request-options.js'
import {setupRequestJson} from './request-json.js'

/**
* @throws
**/
export function setupRequestPayload(request: Request, body: undefined | BodyInit | unknown): Request {
    if (! isDefined(body)) {
        return request
    }
    if (isString(body)) {
        // Serialization is already handled.
        return setupRequestBody(request, body)
    }
    if (body instanceof ArrayBuffer) {
        return setupRequestBody(request, body)
    }
    if (body instanceof Blob) {
        return setupRequestBody(request, body)
    }
    if (body instanceof FormData) {
        return setupRequestBody(request, body)
    }
    if (body instanceof ReadableStream) {
        return setupRequestBody(request, body)
    }
    if (body instanceof URLSearchParams) {
        return setupRequestBody(request, body)
    }
    // At this point body should be JSON serializable.
    return setupRequestJson(request, body)
}

/**
* @throws
**/
export function usingRequestPayload(body: undefined | BodyInit | unknown): Io<Request, Request> {
    return (request: Request) => setupRequestPayload(request, body)
}

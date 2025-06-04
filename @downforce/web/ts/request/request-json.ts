import type {Io} from '@downforce/std/fn'
import {JsonType} from '../mimetype.js'
import {mergeRequestHeaders} from './request-headers.js'
import {setupRequestOptions} from './request-options.js'

/**
* @throws TypeError | InvalidArgument
**/
export function setupRequestJson(request: Request, body: unknown, otherHeaders?: undefined | HeadersInit): Request {
    return setupRequestOptions(request, createRequestJsonOptions(body, otherHeaders))
}

/**
* @throws TypeError | InvalidArgument
**/
export function usingRequestJson(body: unknown, headers?: undefined | HeadersInit): Io<Request, Request> {
    return (request: Request) => setupRequestJson(request, body, headers)
}

export function createRequestJsonOptions(body: unknown, otherHeaders?: undefined | HeadersInit): RequestInit {
    const jsonHeaders: HeadersInit = {
        'Content-Type': JsonType,
    }

    return {
        headers: otherHeaders
            ? mergeRequestHeaders(jsonHeaders, otherHeaders)
            : jsonHeaders
        ,
        ...body
            ? {body: JSON.stringify(body)}
            : undefined
        ,
    }
}

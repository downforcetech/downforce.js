import type {Io} from '@downforce/std/fn'
import {JsonType} from '../mimetype.js'
import {mergeRequestHeaders, type RequestHeadersInit} from './request-headers.js'
import {setupRequestOptions} from './request-options.js'

export function setupRequestJson(request: Request, body: unknown, headers?: undefined | RequestHeadersInit): Request {
    return setupRequestOptions(request, createRequestJsonOptions(body, headers))
}

export function _setupRequestJson(body: unknown, headers?: undefined | RequestHeadersInit): Io<Request, Request> {
    return (request: Request) => setupRequestJson(request, body, headers)
}

export function createRequestJsonOptions(body: unknown, headersOptional?: undefined | RequestHeadersInit): RequestInit {
    const jsonHeaders: HeadersInit = {
        'Content-Type': JsonType,
    }

    return {
        headers: headersOptional
            ? mergeRequestHeaders(jsonHeaders, headersOptional)
            : jsonHeaders
        ,
        ...body
            ? {body: JSON.stringify(body)}
            : undefined
        ,
    }
}

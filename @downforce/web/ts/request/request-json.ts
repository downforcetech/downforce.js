import type {Io} from '@downforce/std/fn'
import {JsonType} from '../mimetype.js'
import {mergeRequestHeaders} from './request-headers.js'
import {setupRequestOptions} from './request-options.js'

/**
* @throws TypeError | InvalidArgument
**/
export function setupRequestJson(request: Request, body: unknown, headers?: undefined | HeadersInit): Request {
    return setupRequestOptions(request, createRequestJsonOptions(body, headers))
}

/**
* @throws TypeError | InvalidArgument
**/
export function useRequestJson(body: unknown, headers?: undefined | HeadersInit): Io<Request, Request> {
    return (request: Request) => setupRequestJson(request, body, headers)
}

export function createRequestJsonOptions(body: unknown, headersOptional?: undefined | HeadersInit): RequestInit {
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

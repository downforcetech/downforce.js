import type {Io} from '@downforce/std/fn'
import type {Options} from '@downforce/std/type'
import {cloneRequest} from './request-clone.js'
import {mergeRequestHeaders, type RequestHeadersInit} from './request-headers.js'
import type {RequestMethodEnum} from './request-method.js'

export function setupRequestOptions(request: Request, options: Options<RequestInit>): Request {
    const {headers, ...otherOptions} = options

    return cloneRequest(request, {
        ...otherOptions,
        ...headers
            ? {headers: mergeRequestHeaders(request.headers, headers)} satisfies RequestInit
            : undefined
        ,
    })
}

export function _setupRequestOptions(options: Options<RequestInit>): Io<Request, Request> {
    return (request: Request) => setupRequestOptions(request, options)
}

// Request Method //////////////////////////////////////////////////////////////

export function setupRequestMethod(request: Request, method: undefined | RequestMethodEnum): Request {
    return setupRequestOptions(request, {method})
}

export function _setupRequestMethod(method: undefined | RequestMethodEnum): Io<Request, Request> {
    return (request: Request) => setupRequestMethod(request, method)
}

// Request Headers /////////////////////////////////////////////////////////////

export function setupRequestHeaders(request: Request, ...headersList: Array<RequestHeadersInit>): Request {
    return cloneRequest(request, {
        headers: mergeRequestHeaders(request.headers, ...headersList),
    })
}

export function _setupRequestHeaders(...headersList: Array<RequestHeadersInit>): Io<Request, Request> {
    return (request: Request) => setupRequestHeaders(request, ...headersList)
}

// Request Body ////////////////////////////////////////////////////////////////

export function setupRequestBody(request: Request, body: undefined | BodyInit): Request {
    return cloneRequest(request, {body})
}

export function _setupRequestBody(body: undefined | BodyInit): Io<Request, Request> {
    return (request: Request) => setupRequestBody(request, body)
}

// Request Cache ///////////////////////////////////////////////////////////////

export function setupRequestCache(request: Request, cache: undefined | RequestCache): Request {
    return cloneRequest(request, {cache})
}

export function _setupRequestCache(cache: undefined | RequestCache): Io<Request, Request> {
    return (request: Request) => setupRequestCache(request, cache)
}

// Request Signal //////////////////////////////////////////////////////////////

export function setupRequestSignal(request: Request, signal: undefined | AbortSignal): Request {
    return cloneRequest(request, {signal})
}

export function _setupRequestSignal(signal: undefined | AbortSignal): Io<Request, Request> {
    return (request: Request) => setupRequestSignal(request, signal)
}

// Request Priority ////////////////////////////////////////////////////////////

export function setupRequestPriority(request: Request, priority: undefined | RequestPriority): Request {
    return cloneRequest(request, {priority})
}

export function _setupRequestPriority(priority: undefined | RequestPriority): Io<Request, Request> {
    return (request: Request) => setupRequestPriority(request, priority)
}

import type {Io} from '@downforce/std/fn'
import type {ObjectPartial} from '@downforce/std/type'
import {cloneRequest} from './request-clone.js'
import {mergeRequestHeaders} from './request-headers.js'
import type {RequestMethodEnum} from './request-method.js'

/**
* @throws TypeError
**/
export function setupRequestOptions(request: Request, options: ObjectPartial<RequestInit>): Request {
    const {headers, ...otherOptions} = options

    return cloneRequest(request, {
        ...otherOptions,
        ...headers
            ? {headers: mergeRequestHeaders(request.headers, headers)} satisfies RequestInit
            : undefined
        ,
    })
}

/**
* @throws TypeError
**/
export function usingRequestOptions(options: ObjectPartial<RequestInit>): Io<Request, Request> {
    return (request: Request) => setupRequestOptions(request, options)
}

// Request Method //////////////////////////////////////////////////////////////

/**
* @throws TypeError
**/
export function setupRequestMethod(request: Request, method: undefined | RequestMethodEnum): Request {
    return setupRequestOptions(request, {method})
}

/**
* @throws TypeError
**/
export function usingRequestMethod(method: undefined | RequestMethodEnum): Io<Request, Request> {
    return (request: Request) => setupRequestMethod(request, method)
}

// Request Headers /////////////////////////////////////////////////////////////

/**
* @throws InvalidArgument
**/
export function setupRequestHeaders(request: Request, ...headersList: Array<HeadersInit>): Request {
    return cloneRequest(request, {
        headers: mergeRequestHeaders(request.headers, ...headersList),
    })
}

/**
* @throws InvalidArgument
**/
export function usingRequestHeaders(...headersList: Array<HeadersInit>): Io<Request, Request> {
    return (request: Request) => setupRequestHeaders(request, ...headersList)
}

// Request Body ////////////////////////////////////////////////////////////////

/**
* @throws TypeError
**/
export function setupRequestBody(request: Request, body: undefined | BodyInit): Request {
    return cloneRequest(request, {body})
}

/**
* @throws TypeError
**/
export function usingRequestBody(body: undefined | BodyInit): Io<Request, Request> {
    return (request: Request) => setupRequestBody(request, body)
}

// Request Cache ///////////////////////////////////////////////////////////////

/**
* @throws
**/
export function setupRequestCache(request: Request, cache: undefined | RequestCache): Request {
    return cloneRequest(request, {cache})
}

/**
* @throws
**/
export function usingRequestCache(cache: undefined | RequestCache): Io<Request, Request> {
    return (request: Request) => setupRequestCache(request, cache)
}

// Request Signal //////////////////////////////////////////////////////////////

/**
* @throws
**/
export function setupRequestSignal(request: Request, signal: undefined | AbortSignal): Request {
    return cloneRequest(request, {signal})
}

/**
* @throws
**/
export function usingRequestSignal(signal: undefined | AbortSignal): Io<Request, Request> {
    return (request: Request) => setupRequestSignal(request, signal)
}

// Request Priority ////////////////////////////////////////////////////////////

/**
* @throws
**/
export function setupRequestPriority(request: Request, priority: undefined | RequestPriority): Request {
    return cloneRequest(request, {priority})
}

/**
* @throws
**/
export function usingRequestPriority(priority: undefined | RequestPriority): Io<Request, Request> {
    return (request: Request) => setupRequestPriority(request, priority)
}

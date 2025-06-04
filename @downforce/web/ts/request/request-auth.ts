import type {Io} from '@downforce/std/fn'
import type {StringAutocompleted} from '@downforce/std/type'
import {setupRequestHeaders} from './request-options.js'

export function createRequestAuthorizationHeaders(type: RequestAuthorizationType, value: string): Record<string, string> {
    return {
        Authorization: `${type} ${value}`,
    } satisfies HeadersInit
}

/**
* @throws
**/
export function setupRequestAuthorization(request: Request, type: RequestAuthorizationType, value: string): Request {
    return setupRequestHeaders(request, createRequestAuthorizationHeaders(type, value))
}

/**
* @throws
**/
export function usingRequestAuthorization(type: RequestAuthorizationType, value: string): Io<Request, Request> {
    return (request: Request) => setupRequestAuthorization(request, type, value)
}

// Types ///////////////////////////////////////////////////////////////////////

export type RequestAuthorizationType = 'Basic' | 'Bearer' | StringAutocompleted

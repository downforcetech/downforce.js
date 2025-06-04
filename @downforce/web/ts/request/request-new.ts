import {piped, type PipeContinuation} from '@downforce/std/fn'
import type {ObjectPartial} from '@downforce/std/type'
import {joinRequestPath} from './request-path.js'
import {RequestMethod, type RequestMethodEnum} from './request-method.js'

export function createRequest(
    method: RequestMethodEnum,
    pathOrUrl: string,
    options?: undefined | RequestOptions,
): Request {
    const {baseUrl, ...requestOptions} = options ?? {}
    const url = joinRequestPath(baseUrl, pathOrUrl)
    const request = new Request(url, {...requestOptions as RequestInit, method})

    return request
}
export function buildRequest(
    method: RequestMethodEnum,
    pathOrUrl: string,
    options?: undefined | RequestOptions,
): PipeContinuation<Request> {
    return piped(createRequest(method, pathOrUrl, options))
}

export function createRequestDelete(pathOrUrl: string, options?: undefined | RequestOptions): Request {
    return createRequest(RequestMethod.Delete, pathOrUrl, options)
}
export function buildRequestDelete(pathOrUrl: string, options?: undefined | RequestOptions): PipeContinuation<Request> {
    return piped(createRequestDelete(pathOrUrl, options))
}

export function createRequestGet(pathOrUrl: string, options?: undefined | RequestOptions): Request {
    return createRequest(RequestMethod.Get, pathOrUrl, options)
}
export function buildRequestGet(pathOrUrl: string, options?: undefined | RequestOptions): PipeContinuation<Request> {
    return piped(createRequestGet(pathOrUrl, options))
}

export function createRequestPatch(pathOrUrl: string, options?: undefined | RequestOptions): Request {
    return createRequest(RequestMethod.Patch, pathOrUrl, options)
}
export function buildRequestPatch(pathOrUrl: string, options?: undefined | RequestOptions): PipeContinuation<Request> {
    return piped(createRequestPatch(pathOrUrl, options))
}

export function createRequestPost(pathOrUrl: string, options?: undefined | RequestOptions): Request {
    return createRequest(RequestMethod.Post, pathOrUrl, options)
}
export function buildRequestPost(pathOrUrl: string, options?: undefined | RequestOptions): PipeContinuation<Request> {
    return piped(createRequestPost(pathOrUrl, options))
}

export function createRequestPut(pathOrUrl: string, options?: undefined | RequestOptions): Request {
    return createRequest(RequestMethod.Put, pathOrUrl, options)
}
export function buildRequestPut(pathOrUrl: string, options?: undefined | RequestOptions): PipeContinuation<Request> {
    return piped(createRequestPut(pathOrUrl, options))
}

// Types ///////////////////////////////////////////////////////////////////////

export interface RequestOptions extends ObjectPartial<RequestInit> {
    baseUrl?: undefined | string
}

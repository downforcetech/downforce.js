import type {ObjectPartial} from '@downforce/std/type'
import {RequestMethod, type RequestMethodEnum} from './request-method.js'
import {joinRequestPath} from './request-path.js'

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

export function createRequestDelete(pathOrUrl: string, options?: undefined | RequestOptions): Request {
    return createRequest(RequestMethod.Delete, pathOrUrl, options)
}

export function createRequestGet(pathOrUrl: string, options?: undefined | RequestOptions): Request {
    return createRequest(RequestMethod.Get, pathOrUrl, options)
}

export function createRequestPatch(pathOrUrl: string, options?: undefined | RequestOptions): Request {
    return createRequest(RequestMethod.Patch, pathOrUrl, options)
}

export function createRequestPost(pathOrUrl: string, options?: undefined | RequestOptions): Request {
    return createRequest(RequestMethod.Post, pathOrUrl, options)
}

export function createRequestPut(pathOrUrl: string, options?: undefined | RequestOptions): Request {
    return createRequest(RequestMethod.Put, pathOrUrl, options)
}

// Types ///////////////////////////////////////////////////////////////////////

export interface RequestOptions extends ObjectPartial<RequestInit> {
    baseUrl?: undefined | string
}

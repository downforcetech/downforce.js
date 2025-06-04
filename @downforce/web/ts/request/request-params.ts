import type {Io} from '@downforce/std/fn'
import {joinUrlWithParams, type UrlParams, type UrlParamsEncodeOptions} from '../url.js'

/**
* @throws TypeError
**/
export function setupRequestParams(request: Request, params: UrlParams, options?: undefined | UrlParamsEncodeOptions): Request {
    const url = joinUrlWithParams(request.url, params, options)
    return new Request(url, request)
}

/**
* @throws TypeError
**/
export function usingRequestParams(...paramsList: Array<UrlParams>): Io<Request, Request> {
    return (request: Request) => setupRequestParams(request, paramsList)
}

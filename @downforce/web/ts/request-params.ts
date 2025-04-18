import type {Io} from '@downforce/std/fn-type'
import {joinUrlWithParams, type UrlParams, type UrlParamsEncodeOptions} from './url-params.js'

/**
* @throws TypeError
**/
export function usingRequestParams(...paramsList: Array<UrlParams>): Io<Request, Request> {
    return (request: Request) => useRequestParams(request, paramsList)
}

/**
* @throws TypeError
**/
export function useRequestParams(request: Request, params: UrlParams, options?: undefined | UrlParamsEncodeOptions): Request {
    const url = joinUrlWithParams(request.url, params, options)
    return new Request(url, request)
}

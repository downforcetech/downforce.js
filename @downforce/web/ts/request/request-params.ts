import type {Io} from '@downforce/std/fn'
import {joinUrlWithParams, type UrlParams, type UrlParamsEncodeOptions} from '../url/url-params.js'

export function setupRequestParams(request: Request, params: UrlParams, options?: undefined | UrlParamsEncodeOptions): Request {
    const url = joinUrlWithParams(request.url, params, options)
    return new Request(url, request)
}

export function _setupRequestParams(...paramsList: Array<UrlParams>): Io<Request, Request> {
    return (request: Request) => setupRequestParams(request, paramsList)
}

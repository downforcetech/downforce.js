import {identity, pipe, piped, type Io} from '@downforce/std/fn'
import {isSome} from '@downforce/std/optional'
import {_thenPromise} from '@downforce/std/promise'
import type {Options} from '@downforce/std/type'
import {setupRequestAuthorization} from './request/request-auth.js'
import {type RequestHeadersInit} from './request/request-headers.js'
import {RequestMethodEnum, type RequestMethodEnumType} from './request/request-method.js'
import {createRequest} from './request/request-new.js'
import {
    setupRequestCache,
    setupRequestCredentials,
    setupRequestHeaders,
    setupRequestOptions,
    setupRequestPriority,
    setupRequestRedirect,
    setupRequestSignal,
} from './request/request-options.js'
import {setupRequestParams} from './request/request-params.js'
import {setupRequestPayload} from './request/request-payload.js'
import {setupRequestRetry, type RequestRetryOptions} from './request/request-retry.js'
import {decodeResponseBody} from './response/response-body.js'
import {rejectResponseFailed} from './response/response-error.js'
import type {UrlParams} from './url/url-params.js'

export {createFormData} from './request/request-body.js'

export const HttpClient = {
    Request<O = Response>(args: HttpClientBaseOptions<Response, O>): NoInfer<Promise<O>> {
        const {
            authToken,
            authType,
            baseUrl,
            body,
            cache,
            credentials,
            decoder,
            encoder,
            headers,
            init,
            method,
            params,
            priority,
            redirect,
            retry,
            signal,
            url,
        } = args

        return pipe(
            createRequest(method, url, {baseUrl}),
            request => init ? setupRequestOptions(request, init) : request,
            request => cache ? setupRequestCache(request, cache) : request,
            request => priority ? setupRequestPriority(request, priority) : request,
            request => signal ? setupRequestSignal(request, signal) : request,
            request => authToken ? setupRequestAuthorization(request, authType ?? 'Bearer', authToken) : request,
            request => credentials ? setupRequestCredentials(request, credentials) : request,
            request => headers ? setupRequestHeaders(request, headers) : request,
            request => redirect ? setupRequestRedirect(request, redirect) : request,
            request => params ? setupRequestParams(request, params) : request,
            request => isSome(body) ? setupRequestPayload(request, body) : request,
            request => encoder ? encoder(request) : request,
            request => retry ? setupRequestRetry(request, retry) : fetch(request),
            responsePromise => decoder ? responsePromise.then(decoder) : responsePromise as Promise<O>,
        )
    },
    Get<O = Response>(args: HttpClientGetOptions<Response, O>): NoInfer<Promise<O>> {
        return HttpClient.Request({
            ...args,
            method: RequestMethodEnum.Get,
        })
    },
    Delete<O = Response>(args: HttpClientDeleteOptions<Response, O>): NoInfer<Promise<O>> {
        return HttpClient.Request({
            ...args,
            method: RequestMethodEnum.Delete,
        })
    },
    Patch<O = Response>(args: HttpClientPatchOptions<Response, O>): NoInfer<Promise<O>> {
        return HttpClient.Request({
            ...args,
            method: RequestMethodEnum.Patch,
        })
    },
    Put<O = Response>(args: HttpClientPutOptions<Response, O>): NoInfer<Promise<O>> {
        return HttpClient.Request({
            ...args,
            method: RequestMethodEnum.Put,
        })
    },
    Post<O = Response>(args: HttpClientPostOptions<Response, O>): NoInfer<Promise<O>> {
        return HttpClient.Request({
            ...args,
            method: RequestMethodEnum.Post,
        })
    },
}

export function createResponseDecoder(): Io<Response | Promise<Response>, Promise<unknown>>
export function createResponseDecoder<O>(contentDecoder: Io<unknown, O | Promise<O>>): Io<Response | Promise<Response>, Promise<O>>
export function createResponseDecoder<O>(contentDecoder?: undefined | Io<unknown, O | Promise<O>>): Io<Response | Promise<Response>, Promise<unknown | O>> {
    function decode(responsePromise: Response | Promise<Response>): Promise<unknown | O> {
        return decodeResponseOrReject(responsePromise, contentDecoder ?? identity)
    }

    return decode
}

export async function decodeResponseOrReject<O>(
    responsePromise: Response | Promise<Response>,
    decodeContent: Io<unknown, O | Promise<O>>,
): Promise<O> {
    return piped(responsePromise)
        (rejectResponseFailed) // Rejects on not ok response (4xx/5xx).
        (decodeResponseBody) // Decodes response to FormData/JSON/Text/UrlSearchParams.
        (_thenPromise(decodeContent)) // Decodes the mixed unsafe output.
    ()
}

/**
* This function can be used to cast an `unknown` input to an `Unsafe<?>` input.
* The condition `unknown extends I ? O : unknown` ensures that this function
* can't be used to cast a known value (for example `Response`) to a different
* value (for example `Unsafe<?>`).
*/
export function castingUnknown<O>(fn: Io<any, O>): (<I>(input: I) => unknown extends I ? O : unknown) {
    function cast<I>(input: I): unknown extends I ? O : unknown {
        return fn(input as any)
    }

    return cast
}

// Types ///////////////////////////////////////////////////////////////////////

export interface HttpClientRequestOptions {
    authToken?: undefined | string
    authType?: undefined | string
    baseUrl?: undefined | string
    body?: undefined | BodyInit | unknown
    cache?: undefined | RequestCache
    credentials?: undefined | RequestCredentials
    encoder?: undefined | Io<Request, Request>
    headers?: undefined | RequestHeadersInit
    init?: undefined | Options<RequestInit>
    method: RequestMethodEnumType
    params?: undefined | UrlParams
    priority?: undefined | RequestPriority
    redirect?: undefined | RequestRedirect
    retry?: undefined | RequestRetryOptions
    signal?: undefined | AbortSignal
    url: string
}

export interface HttpClientResponseOptions<R, O = R> {
    decoder?: undefined | Io<R, O | Promise<O>>
}

export type HttpClientBaseOptions<R, O = R> = HttpClientRequestOptions & HttpClientResponseOptions<R, O>
export type HttpClientGetOptions<R, O = R> = Omit<HttpClientBaseOptions<R, O>, 'method'>
export type HttpClientDeleteOptions<R, O = R> = Omit<HttpClientBaseOptions<R, O>, 'method'>
export type HttpClientPatchOptions<R, O = R> = Omit<HttpClientBaseOptions<R, O>, 'method'>
export type HttpClientPutOptions<R, O = R> = Omit<HttpClientBaseOptions<R, O>, 'method'>
export type HttpClientPostOptions<R, O = R> = Omit<HttpClientBaseOptions<R, O>, 'method'>

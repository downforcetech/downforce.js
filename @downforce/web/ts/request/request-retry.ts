import {wait} from '@downforce/std/async'
import {OneSecondInMs} from '@downforce/std/date'
import {compute, isFunction, type Computable, type Fn, type Io} from '@downforce/std/fn'
import {clamp} from '@downforce/std/number'
import type {Void} from '@downforce/std/type'
import {cloneRequestWithBody} from './request-clone.js'

export async function setupRequestRetry(request: Request, options?: undefined | RequestRetryOptions): Promise<Response> {
    const executor: Io<Request, Promise<Response>> = options?.executor ?? fetch
    const computeDelay = isFunction(options?.delay) ? options.delay : createRequestRetryDelayComputer(options?.delay)
    const shouldRetry = options?.shouldRetry ?? isRequestRetryable
    const retryTimes = Math.max(0, options?.times ?? 3)
    const onRetry = options?.onRetry

    let retryAttempt = 0

    function executeRequest(): Promise<Response> {
        // We need to clone the request otherwise a TypeError is raised due to used body.
        // `new Request(request)` doesn't work; we need `request.clone()`.
        return executor(cloneRequestWithBody(request))
    }

    while (true) {
        const responsePromise = executeRequest()

        if (! await shouldRetry(responsePromise)) {
            return responsePromise
        }

        if (retryAttempt === retryTimes) {
            throw responsePromise
        }

        retryAttempt += 1

        const retryDelay = computeDelay(retryAttempt)

        await wait(retryDelay)

        onRetry?.(retryAttempt, request, responsePromise)

        continue
    }
}

export function _setupRequestRetry(options?: undefined | RequestRetryOptions): Io<Request, Promise<Response>> {
    function continuation(request: Request): Promise<Response> {
        return setupRequestRetry(request, options)
    }

    return continuation
}

export async function isRequestRetryable(responsePromise: Promise<Response>): Promise<boolean> {
    const response = await responsePromise

    // Selects response errors eligible for retrying.
    switch (response.status) {
        case 408: // Request Timeout
        case 429: // Too Many Requests
        case 502: // Bad Gateway
        case 503: // Service Unavailable
        case 504: // Gateway Timeout
        case 507: // Insufficient Storage
            return true
    }
    return false
}

export function createRequestRetryDelayComputer(options?: undefined | RequestRetryDelayOptions): RequestRetryDelayComputer {
    return (attempt: number) => computeRequestRetryDelay(attempt, options)
}

export function computeRequestRetryDelay(attempt: number, options?: undefined | RequestRetryDelayOptions): number {
    const delayBase = compute(options?.delayBase ?? 2, attempt)
    const delayExp = compute(options?.delayExp ?? (attempt - 1), attempt)
    const delayFactor = compute(options?.delayFactor ?? attempt, attempt)
    const delayMax = options?.delayMax ?? 30_000
    const delayMin = options?.delayMin ?? 1_000

    const delay = OneSecondInMs * delayFactor * Math.pow(delayBase, delayExp)

    return clamp(delayMin, delay, delayMax)
}

// Types ///////////////////////////////////////////////////////////////////////

export interface RequestRetryOptions {
    delay?: undefined | RequestRetryDelayOptions | RequestRetryDelayComputer
    executor?: undefined | Io<Request, Promise<Response>>
    onRetry?: undefined | Fn<[attempt: number, request: Request, response: Promise<Response>], Void>
    shouldRetry?: undefined | Io<Promise<Response>, Promise<boolean>>
    times?: undefined | number
}

export interface RequestRetryDelayOptions {
    delayBase?: undefined | Computable<number, [attempt: number]> // In milliseconds.
    delayExp?: undefined | Computable<number, [attempt: number]>
    delayFactor?: undefined | Computable<number, [attempt: number]>
    delayMin?: undefined | number // In milliseconds.
    delayMax?: undefined | number // In milliseconds.
}

export type RequestRetryDelayComputer = (attempt: number) => number

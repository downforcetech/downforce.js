import {isString} from '@downforce/std/string'
import {encodeUrlParamKey, encodeUrlParams, encodeUrlParamValue, joinUrlWithParamsString} from '../url/url-params.js'
import type {RouterRoute, RouterRouteChange, RouterRouteChangeParams, RouterRouteParams} from './router-type.js'

export function areSameRoutes<S>(firstRoute: RouterRoute<S>, secondRoute: RouterRoute<S>): boolean {
    const samePath = firstRoute.path === secondRoute.path
    const sameParams = encodeUrlParams(firstRoute.params) === encodeUrlParams(secondRoute.params)
    const sameState = firstRoute.state === secondRoute.state
    return samePath && sameParams && sameState
}

export function mergeRouteChange<S>(route: RouterRoute<S>, routeChange: RouterRouteChange<S>): RouterRoute<S> {
    const [changePath, changePathParamsString] = routeChange.path?.split('?') ?? []
    const changePathParams = decodeRouteParams(changePathParamsString)
    const changeParams = flattenRouteParams(routeChange.params)

    return {
        path: changePath || route.path, // changePath can be an empty string.
        // Params and State, if not provided, must be set to undefined.
        params: changePathParams && changeParams
            // changeParams has precedence over (overwrites) changePathParams.
            ? {...changePathParams, ...changeParams} // Merge.
            : (changeParams ?? changePathParams) // First one defined "wins".
        ,
        state: routeChange.state,
    }
}

export function decodeRouteParams(paramsString: undefined | string): undefined | RouterRouteParams {
    if (! paramsString) {
        // Undefined or empty string must return undefined.
        return
    }

    const params: RouterRouteParams = {}
    const parts = paramsString.split('&')

    for (const part of parts) {
        const [keyEncoded, valueEncoded] = part.split('=')
        // We need to decode because:
        // - the key can be ANY string
        // - the value can be ANY string (even an Array/Object serialized as string).
        const key = keyEncoded ? decodeURIComponent(keyEncoded) : keyEncoded
        const value = valueEncoded ? decodeURIComponent(valueEncoded) : valueEncoded

        if (! key) {
            continue
        }

        params[key] = value ?? ''
    }

    return params
}

/**
* @throws InvalidArgument
**/
export function encodeLink(url: string, params?: undefined | RouterRouteChangeParams): string {
    const [urlPath, urlParams] = url.split('?')
    const paramsString = encodeRouteParams(params)
    const allParams = [urlParams, paramsString].filter(Boolean).join('&')
    const linkEncoded = joinUrlWithParamsString(urlPath ?? '', allParams)
    return linkEncoded
}

/**
* @throws InvalidArgument
**/
export function encodeRoute(path: string, params?: undefined | RouterRouteChangeParams): string {
    const paramsString = encodeRouteParams(params)
    const routeEncoded = joinUrlWithParamsString(path, paramsString)
    return routeEncoded
}

export function encodeRouteParams(params: undefined | RouterRouteChangeParams): string {
    return encodeUrlParams(params, {
        encodeKey: encodeRouteParamKey,
        encodeValue: encodeRouteParamValue,
    })
}

/**
* @throws InvalidArgument
**/
export function encodeRouteParamKey(key: unknown): string {
    if (isString(key)) {
        // We don't encode route params keys of type string.
        // Encoding is an opt-in feature of the developer.
        // In this way the Browser url bar shows
        // `?book:id`
        // instead of
        // `?book%3Aid`.
        return key
    }
    return encodeUrlParamKey(key)
}

/**
* @throws InvalidArgument
**/
export function encodeRouteParamValue(value: unknown): string {
    if (isString(value)) {
        // We don't encode route params values of type string.
        // Encoding is an opt-in feature of the developer.
        // In this way the Browser url bar shows
        // `?redirect=/some/path`
        // instead of
        // `?redirect=%2Fsome%2Fpath`.
        return value
    }
    return encodeUrlParamValue(value)
}

/**
* @throws InvalidArgument
**/
export function flattenRouteParams(routeParams: RouterRouteChangeParams): RouterRouteParams
export function flattenRouteParams(routeParams: undefined | RouterRouteChangeParams): undefined | RouterRouteParams
export function flattenRouteParams(routeParams: undefined | RouterRouteChangeParams): undefined | RouterRouteParams {
    return routeParams
        ? decodeRouteParams(
            encodeUrlParams(routeParams) || undefined // Casts '' to undefined.
        )
        : undefined
}

import {isArray} from '@downforce/std/array'
import {isDateString} from '@downforce/std/date'
import type {Fn, Io} from '@downforce/std/fn'
import {isNumber} from '@downforce/std/number'
import {isObject} from '@downforce/std/object'
import {isNull, isSome, isUndefined} from '@downforce/std/optional'
import {isString} from '@downforce/std/string'
import {kindOf} from '@downforce/std/type'

export function joinUrlWithParams(url: string, params: UrlParams, options?: undefined | UrlParamsEncodeOptions): string {
    const paramsUrl = encodeUrlParams(params, options)
    const urlWithParams = joinUrlWithParamsString(url, paramsUrl)
    return urlWithParams
}

export function joinUrlWithParamsString(url: string, params: undefined | string): string {
    if (! params) {
        return url
    }

    const separator = url.includes('?')
        ? '&'
        : '?'

    return url + separator + params
}

export function joinUrlParams(...paramsList: Array<string>): string {
    return joinUrlParamsList(paramsList)
}

export function joinUrlParamsList(paramsList: Array<string>): string {
    // Without the empty strings.
    return paramsList.filter(Boolean).join('&')
}

export function encodeUrlParams(params: undefined | UrlParams, options?: undefined | UrlParamsEncodeOptions): string {
    if (! params) {
        return ''
    }
    if (isDateString(params)) {
        // A plain string is an escape hatch and must be considered already encoded.
        // We must not use encodeURIComponent() on it.
        return params
    }
    if (isObject(params)) {
        return encodeUrlParamsObject(params, options)
    }
    if (isArray(params)) {
        return encodeUrlParamsArray(params, options)
    }
    return ''
}

export function encodeUrlParamsObject(params: UrlParamsDict, options?: undefined | UrlParamsEncodeOptions): string {
    const encodeKey = options?.encodeKey ?? encodeUrlParamKey
    const encodeValue = options?.encodeValue ?? encodeUrlParamValue
    const joinParam = options?.joinParam ?? joinUrlParam
    const joinParts = options?.joinParts ?? joinUrlParamsList

    const paramsParts = Object.entries(params).map(([key, value]) => {
        if (isUndefined(value)) {
            // A key with an undefined value is removed.
            return
        }
        if (isNull(value)) {
            // A key with a null value is encoded without a value.
            return encodeKey(key)
        }
        return joinParam(encodeKey(key), encodeValue(value))
    }).filter(isSome)

    const encodedParams = joinParts(paramsParts)

    return encodedParams
}

export function encodeUrlParamsArray(params: UrlParamsList, options?: undefined | UrlParamsEncodeOptions): string {
    const encodeKey = options?.encodeKey ?? encodeUrlParamKey
    const joinParts = options?.joinParts ?? joinUrlParamsList

    const paramsParts = params.map(param => {
        const paramType = kindOf(param, 'undefined', 'null', 'boolean', 'array', 'object')

        switch (paramType) {
            case 'undefined':
            case 'null':
            case 'boolean':
                return
            case 'array':
            case 'object':
                return encodeUrlParams(param as UrlParamsList | UrlParamsDict, options)
            // case 'string'
            // case 'number'
            default:
                return encodeKey(param)
        }
    }).filter(isSome)

    const encodedParams = joinParts(paramsParts)

    return encodedParams
}

export function encodeUrlParamKey(name: unknown): string {
    if (isString(name)) {
        return encodeURIComponent(name as string)
    }
    if (isNumber(name)) {
        return String(name)
    }
    return ''
}

export function encodeUrlParamValue(value: unknown): string {
    const type = kindOf(value, 'undefined', 'null', 'boolean', 'number', 'string', 'array', 'object')

    switch (type) {
        case 'undefined':
        case 'null':
            return ''
        case 'boolean':
        case 'number':
            return String(value)
        case 'string':
            return encodeURIComponent(value as string)
        case 'array':
        case 'object':
            return encodeURIComponent(JSON.stringify(value))
        default:
            return ''
    }
}

export function joinUrlParam(name: string, value: string): string {
    return `${name}=${value}`
}

// Types ///////////////////////////////////////////////////////////////////////

export type UrlParams =
    | undefined // Accepted but ignored.
    | null // Accepted but ignored.
    | string
    | UrlParamsList
    | UrlParamsDict

export type UrlParamsList = Array<UrlParamsListValue>
export type UrlParamsDict = {[key: UrlParamsDictKey]: UrlParamsDictValue}

export type UrlParamsListValue =
    | undefined // Accepted but ignored.
    | null // Accepted but ignored.
    | boolean // Accepted but ignored.
    | number
    | string
    | UrlParamsDict
    | UrlParamsList

export type UrlParamsDictKey = number | string
export type UrlParamsDictValue =
    | undefined
    | null
    | boolean
    | number
    | string
    | UrlParamsDict
    | UrlParamsList

export interface UrlParamsEncodeOptions {
    encodeKey?: undefined | Io<unknown, string>
    encodeValue?: undefined | Io<unknown, string>
    joinParam?: undefined | Fn<[name: string, value: string], string>
    joinParts?: undefined | Io<Array<string>, string>
}

import {piping, type PipeContinuation} from '@eviljs/std/fn-pipe.js'
import type {Io} from '@eviljs/std/fn-type.js'
import {asObject} from '@eviljs/std/type-as.js'
import {JsonType} from './mimetype.js'
import {usingRequestMethod} from './request-init.js'
import {usingRequestJson} from './request-json.js'
import {usingRequestOptions} from './request-merge.js'
import {RequestMethod, creatingRequest, type RequestOptions} from './request-method.js'
import {usingRequestParams} from './request-params.js'
import {decodeResponseBodyAsJson} from './response.js'

export const GraphqlQueryCommentRegexp = /[#].*/g
export const GraphqlQueryEmptiesRegexp = /\s+/g
export const GraphqlQueryLeadingEmptiesRegexp = /\s+([{}])/g
export const GraphqlQueryTrailingEmptiesRegexp = /([{}])\s+/g

/**
* @throws TypeError
**/
export function creatingRequestGraphqlGet(pathOrUrl: string, options: RequestOptions & {
    query: string
    variables?: undefined | GraphqlQueryVariables
}): PipeContinuation<Request> {
    const {query, variables, ...requestOptions} = options

    return creatingRequest(RequestMethod.Get, pathOrUrl, requestOptions)
        (usingRequestGraphqlGet(query, variables))
}

/**
* @throws TypeError
**/
export function usingRequestGraphqlGet(query: string, variables?: undefined | GraphqlQueryVariables): Io<Request, Request> {
    return (request: Request) => useRequestGraphqlGet(request, query, variables)
}

/**
* @throws TypeError
**/
export function useRequestGraphqlGet(request: Request, query: string, variables?: undefined | GraphqlQueryVariables): Request {
    return piping(request)
        (usingRequestOptions({
            method: RequestMethod.Get,
            headers: {
                'Accept': JsonType,
            },
        }))
        (usingRequestParams({
            query: compressGraphqlQuery(query),
            variables: variables
                ? JSON.stringify(variables)
                : undefined
            ,
        }))
    ()
}

/**
* @throws TypeError
**/
export function creatingRequestGraphqlPost(pathOrUrl: string, options: RequestOptions & {
    query: string
    variables?: undefined | GraphqlQueryVariables
}): PipeContinuation<Request> {
    const {query, variables, ...requestOptions} = options

    return creatingRequest(RequestMethod.Post, pathOrUrl, requestOptions)
        (usingRequestGraphqlPost(query, variables))
}

/**
* @throws TypeError
**/
export function usingRequestGraphqlPost(query: string, variables?: undefined | GraphqlQueryVariables): Io<Request, Request> {
    return (request: Request) => useRequestGraphqlPost(request, query, variables)
}

/**
* @throws TypeError
**/
export function useRequestGraphqlPost(request: Request, query: string, variables?: undefined | GraphqlQueryVariables): Request {
    const body = {query, variables}

    return piping(request)
        (usingRequestMethod(RequestMethod.Post))
        (usingRequestJson(body, {
            'Accept': JsonType,
        }))
    ()
}

/**
* @throws
**/
export function useResponseGraphql<V = unknown>(response: Response | Promise<Response>): Promise<V> {
    return Promise.resolve(response)
        .then(decodeResponseBodyAsJson)
        .then(it => asObject(it)?.data as V)
}

export function compressGraphqlQuery(query: string): string {
    return query
        .replaceAll(GraphqlQueryCommentRegexp, '')
        .replaceAll(GraphqlQueryEmptiesRegexp, ' ')
        .replaceAll(GraphqlQueryLeadingEmptiesRegexp, '$1')
        .replaceAll(GraphqlQueryTrailingEmptiesRegexp, '$1')
}

// Types ///////////////////////////////////////////////////////////////////////

export type GraphqlQueryVariables = Record<string, any>

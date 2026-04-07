import {piped, type Io, type PipeContinuation} from '@downforce/std/fn'
import {JsonType} from '../mimetype.js'
import type {GraphqlQueryVariables} from './request-graphql.js'
import {useRequestJson} from './request-json.js'
import {RequestMethod} from './request-method.js'
import {buildRequest, type RequestOptions} from './request-new.js'
import {useRequestMethod} from './request-options.js'

/**
* @throws TypeError
**/
export function buildRequestGraphqlPost(pathOrUrl: string, options: RequestOptions & {
    query: string
    variables?: undefined | GraphqlQueryVariables
}): PipeContinuation<Request> {
    const {query, variables, ...requestOptions} = options

    return (
        buildRequest(RequestMethod.Post, pathOrUrl, requestOptions)
        (useRequestGraphqlPost(query, variables))
    )
}

/**
* @throws TypeError
**/
export function setupRequestGraphqlPost(request: Request, query: string, variables?: undefined | GraphqlQueryVariables): Request {
    const body = {query, variables}

    return piped(request)
        (useRequestMethod(RequestMethod.Post))
        (useRequestJson(body, {
            'Accept': JsonType,
        }))
    ()
}

/**
* @throws TypeError
**/
export function useRequestGraphqlPost(query: string, variables?: undefined | GraphqlQueryVariables): Io<Request, Request> {
    return (request: Request) => setupRequestGraphqlPost(request, query, variables)
}

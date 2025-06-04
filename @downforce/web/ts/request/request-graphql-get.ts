import {piped, type Io, type PipeContinuation} from '@downforce/std/fn'
import {JsonType} from '../mimetype.js'
import {createGraphqlGetParams, type GraphqlQueryVariables} from './request-graphql.js'
import {RequestMethod} from './request-method.js'
import {buildRequest, type RequestOptions} from './request-new.js'
import {usingRequestOptions} from './request-options.js'
import {usingRequestParams} from './request-params.js'

/**
* @throws TypeError
**/
export function buildRequestGraphqlGet(pathOrUrl: string, options: RequestOptions & {
    query: string
    variables?: undefined | GraphqlQueryVariables
}): PipeContinuation<Request> {
    const {query, variables, ...requestOptions} = options

    return (
        buildRequest(RequestMethod.Get, pathOrUrl, requestOptions)
        (usingRequestGraphqlGet(query, variables))
    )
}

/**
* @throws TypeError
**/
export function useRequestGraphqlGet(request: Request, query: string, variables?: undefined | GraphqlQueryVariables): Request {
    return piped(request)
        (usingRequestOptions({
            method: RequestMethod.Get,
            headers: {
                'Accept': JsonType,
            },
        }))
        (usingRequestParams(createGraphqlGetParams(query, variables)))
    ()
}

/**
* @throws TypeError
**/
export function usingRequestGraphqlGet(query: string, variables?: undefined | GraphqlQueryVariables): Io<Request, Request> {
    return (request: Request) => useRequestGraphqlGet(request, query, variables)
}

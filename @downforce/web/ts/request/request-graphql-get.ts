import {piped, type Io, type PipeContinuation} from '@downforce/std/fn'
import {JsonType} from '../mimetype.js'
import {createGraphqlGetParams, type GraphqlQueryVariables} from './request-graphql.js'
import {RequestMethod} from './request-method.js'
import {buildRequest, type RequestOptions} from './request-new.js'
import {useRequestOptions} from './request-options.js'
import {useRequestParams} from './request-params.js'

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
        (useRequestGraphqlGet(query, variables))
    )
}

/**
* @throws TypeError
**/
export function setupRequestGraphqlGet(request: Request, query: string, variables?: undefined | GraphqlQueryVariables): Request {
    return piped(request)
        (useRequestOptions({
            method: RequestMethod.Get,
            headers: {
                'Accept': JsonType,
            },
        }))
        (useRequestParams(createGraphqlGetParams(query, variables)))
    ()
}

/**
* @throws TypeError
**/
export function useRequestGraphqlGet(query: string, variables?: undefined | GraphqlQueryVariables): Io<Request, Request> {
    return (request: Request) => setupRequestGraphqlGet(request, query, variables)
}

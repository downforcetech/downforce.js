import {pipe, type Io} from '@downforce/std/fn'
import {JsonType} from '../mimetype.js'
import {createGraphqlGetParams, type GraphqlQueryVariables} from './request-graphql.js'
import {RequestMethod} from './request-method.js'
import {createRequest, type RequestOptions} from './request-new.js'
import {setupRequestOptions} from './request-options.js'
import {setupRequestParams} from './request-params.js'

export function createRequestGraphqlGet(pathOrUrl: string, options: RequestOptions & {
    query: string
    variables?: undefined | GraphqlQueryVariables
}): Request {
    const {query, variables, ...requestOptions} = options

    return pipe(
        createRequest(RequestMethod.Get, pathOrUrl, requestOptions),
        request => setupRequestGraphqlGet(request, query, variables),
    )
}

export function setupRequestGraphqlGet(request: Request, query: string, variables?: undefined | GraphqlQueryVariables): Request {
    return pipe(
        request,
        request => setupRequestOptions(request, {
            method: RequestMethod.Get,
            headers: {
                'Accept': JsonType,
            },
        }),
        request => setupRequestParams(request, createGraphqlGetParams(query, variables)),
    )
}

export function _setupRequestGraphqlGet(query: string, variables?: undefined | GraphqlQueryVariables): Io<Request, Request> {
    return (request: Request) => setupRequestGraphqlGet(request, query, variables)
}

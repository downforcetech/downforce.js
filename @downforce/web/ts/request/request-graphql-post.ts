import {pipe, type Io} from '@downforce/std/fn'
import {JsonType} from '../mimetype.js'
import type {GraphqlQueryVariables} from './request-graphql.js'
import {setupRequestJson} from './request-json.js'
import {RequestMethod} from './request-method.js'
import {createRequest, type RequestOptions} from './request-new.js'
import {setupRequestMethod} from './request-options.js'

export function createRequestGraphqlPost(pathOrUrl: string, options: RequestOptions & {
    query: string
    variables?: undefined | GraphqlQueryVariables
}): Request {
    const {query, variables, ...requestOptions} = options

    return pipe(
        createRequest(RequestMethod.Post, pathOrUrl, requestOptions),
        _setupRequestGraphqlPost(query, variables),
    )
}

export function setupRequestGraphqlPost(request: Request, query: string, variables?: undefined | GraphqlQueryVariables): Request {
    const body = {query, variables}

    return pipe(
        request,
        request => setupRequestMethod(request, RequestMethod.Post),
        request => setupRequestJson(request, body, {
            'Accept': JsonType,
        }),
    )
}

export function _setupRequestGraphqlPost(query: string, variables?: undefined | GraphqlQueryVariables): Io<Request, Request> {
    return (request: Request) => setupRequestGraphqlPost(request, query, variables)
}

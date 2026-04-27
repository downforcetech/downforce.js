import {pipe, type Io} from '@downforce/std/fn'
import type {UrlParams} from '../url.js'
import {setupRequestHeaders} from './request-options.js'
import {setupRequestParams} from './request-params.js'

export const QueryRulesParam = 'rule'
export const QueryRulesHeader = 'X-Rule'

export function setupRequestRule(request: Request, ...rules: Array<RequestRules>): Request {
    return pipe(
        request,
        request => setupRequestHeaders(request, {[QueryRulesHeader]: ''}),
        request => setupRequestParams(request, {[QueryRulesParam]: rules}),
    )
}

export function _setupRequestRule(...rules: Array<RequestRules>): Io<Request, Request> {
    return (request: Request) => setupRequestRule(request, rules)
}

// Types ///////////////////////////////////////////////////////////////////////

export type RequestRules = UrlParams

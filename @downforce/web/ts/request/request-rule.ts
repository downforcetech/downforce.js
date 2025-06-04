import {piped, type Io} from '@downforce/std/fn'
import type {UrlParams} from '../url.js'
import {usingRequestHeaders} from './request-options.js'
import {usingRequestParams} from './request-params.js'

export const QueryRulesParam = 'rule'
export const QueryRulesHeader = 'X-Rule'

/**
* @throws TypeError | InvalidArgument
**/
export function setupRequestRule(request: Request, ...rules: Array<RequestRules>): Request {
    return piped(request)
        (usingRequestHeaders({[QueryRulesHeader]: ''}))
        (usingRequestParams({[QueryRulesParam]: rules}))
    ()
}

/**
* @throws TypeError | InvalidArgument
**/
export function usingRequestRule(...rules: Array<RequestRules>): Io<Request, Request> {
    return (request: Request) => setupRequestRule(request, rules)
}

// Types ///////////////////////////////////////////////////////////////////////

export type RequestRules = UrlParams

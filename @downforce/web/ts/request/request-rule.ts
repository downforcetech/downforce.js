import {piped, type Io} from '@downforce/std/fn'
import type {UrlParams} from '../url.js'
import {useRequestHeaders} from './request-options.js'
import {useRequestParams} from './request-params.js'

export const QueryRulesParam = 'rule'
export const QueryRulesHeader = 'X-Rule'

/**
* @throws TypeError | InvalidArgument
**/
export function setupRequestRule(request: Request, ...rules: Array<RequestRules>): Request {
    return piped(request)
        (useRequestHeaders({[QueryRulesHeader]: ''}))
        (useRequestParams({[QueryRulesParam]: rules}))
    ()
}

/**
* @throws TypeError | InvalidArgument
**/
export function useRequestRule(...rules: Array<RequestRules>): Io<Request, Request> {
    return (request: Request) => setupRequestRule(request, rules)
}

// Types ///////////////////////////////////////////////////////////////////////

export type RequestRules = UrlParams

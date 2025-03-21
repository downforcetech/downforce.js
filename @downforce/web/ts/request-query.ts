import {piping} from '@downforce/std/fn-pipe'
import type {Io} from '@downforce/std/fn-type'
import {usingRequestHeaders} from './request-init.js'
import {usingRequestParams} from './request-params.js'
import type {UrlParams} from './url-params.js'

export const QueryRulesParam = 'query'
export const QueryRulesHeader = 'X-Query'

/**
* @throws TypeError | InvalidArgument
**/
export function usingRequestQuery(rules: QueryRules): Io<Request, Request> {
    return (request: Request) => useRequestQuery(request, rules)
}
/**
* @throws TypeError | InvalidArgument
**/
export function useRequestQuery(request: Request, rules: QueryRules): Request {
    return piping(request)
        (usingRequestHeaders({[QueryRulesHeader]: ''}))
        (usingRequestParams({[QueryRulesParam]: rules}))
    ()
}

// Types ///////////////////////////////////////////////////////////////////////

export type QueryRules = UrlParams

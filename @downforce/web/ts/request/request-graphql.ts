import type {UrlParams} from '../url.js'

export const GraphqlQueryCommentRegexp: RegExp = /[#].*/g
export const GraphqlQueryEmptiesRegexp: RegExp = /\s+/g
export const GraphqlQueryLeadingEmptiesRegexp: RegExp = /\s+([{}])/g
export const GraphqlQueryTrailingEmptiesRegexp: RegExp = /([{}])\s+/g


export function createGraphqlGetParams(
    query: string,
    variables?: undefined | GraphqlQueryVariables,
): UrlParams {
    return {
        query: compressGraphqlQuery(query),
        variables: variables
            ? JSON.stringify(variables)
            : undefined
        ,
    }
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

import {compute, piped, type Computable, type Fn, type FnArgs} from '@downforce/std/fn'
import {isObject} from '@downforce/std/object'
import {trustString} from '@downforce/std/string'
import {throwInvalidResponse} from './error.js'
import {buildRequest, RequestMethod, usingRequestJson} from './request.js'
import {decodeResponseBody} from './response.js'

export const AuthUrlDefault = '/auth'

export async function authenticate(credentials: AuthCredentials, optionsComputable: AuthAuthenticateOptions): Promise<string> {
    const {
        url,
        method: methodOptional,
        requestBody: requestBodyOptional,
        responseError: responseErrorOptional,
        responseToken: responseTokenOptional,
        ...requestOptions
    } = compute(optionsComputable, credentials)

    const method = methodOptional ?? RequestMethod.Post
    const requestBody = requestBodyOptional ?? createDefaultRequestBody(credentials)

    const response = await buildRequest(method, url, requestOptions)
        (usingRequestJson(requestBody))
        (fetch)
        (promise => promise.catch(error => {
            return throwAuthInvalidResponse('authenticate', AuthMessages.failedResponse(error))
        }))
    ()

    const responseBody = await piped(response)
        (decodeResponseBody)
        (promise => promise.catch(error => {
            return throwAuthInvalidResponse('authenticate', AuthMessages.failedResponseDecoding(error))
        }))
    ()

    if (! response.ok) {
        const extractResponseError = responseErrorOptional ?? extractDefaultResponseError
        const error = extractResponseError(responseBody)

        return throwAuthInvalidResponse('authenticate', AuthMessages.invalidResponseStatusWithError(response, error))
    }

    if (! isObject(responseBody)) {
        return throwAuthInvalidResponse('authenticate', AuthMessages.invalidResponseBody(responseBody))
    }

    if (response.ok) {
        const extractResponseToken = responseTokenOptional ?? extractDefaultResponseToken
        const token = extractResponseToken(responseBody)

        if (! token) {
            return throwAuthInvalidResponse('authenticate', AuthMessages.invalidResponseToken(responseBody))
        }

        return token
    }

    return throwAuthInvalidResponse('authenticate', AuthMessages.invalidResponseStatus(response))
}

export async function validateAuthentication(token: string, optionsComputable: AuthValidateOptions): Promise<boolean> {
    const {
        url,
        method: methodOptional,
        ...requestOptions
    } = compute(optionsComputable, token)

    const method = methodOptional ?? RequestMethod.Get

    const response = await buildRequest(method, url, requestOptions)
        (fetch)
        (promise => promise.catch(error => {
            return throwAuthInvalidResponse('validateAuthentication', AuthMessages.failedResponse(error))
        }))
    ()

    return response.ok
}

export async function invalidateAuthentication(token: string, optionsComputable: AuthInvalidateOptions): Promise<boolean> {
    const {
        url,
        method: methodOptional,
        ...requestOptions
    } = compute(optionsComputable, token)

    const method = methodOptional ?? RequestMethod.Delete

    const response = await buildRequest(method, url, requestOptions)
        (fetch)
        (promise => promise.catch(error => {
            return throwAuthInvalidResponse('invalidateAuthentication', AuthMessages.failedResponse(error))
        }))
    ()

    if (! response.ok) {
        return throwAuthInvalidResponse('invalidateAuthentication', AuthMessages.invalidResponseStatus(response))
    }

    return response.ok
}

export function createDefaultRequestBody(credentials: AuthCredentials): AuthCredentials {
    return {
        identifier: credentials.identifier,
        secret: credentials.secret,
    }
}

export function extractDefaultResponseError(body: unknown): unknown {
    return body
}

export function extractDefaultResponseToken(body: unknown): undefined | string {
    return isObject(body)
        ? (trustString(body.token) || undefined)
        : undefined
}

export function throwAuthInvalidResponse(fnName: string, reason: string): never {
    return throwInvalidResponse(
        `${fnName}() -> ~~Response~~:\n`
        + reason
    )
}

export const AuthMessages = {
    failedResponse(error: unknown) {
        return `Request failed with error "${String(error)}".`
    },
    failedResponseDecoding(error: unknown) {
        return `Response decoding failed with error "${String(error)}".`
    },
    invalidResponseBody(responseBody: unknown) {
        return `Response must have a well formed JSON content, given "${String(responseBody)}".`
    },
    invalidResponseStatus(response: Response) {
        return `Response must have a 2xx status, given "${response.status}" (${response.statusText}).`
    },
    invalidResponseStatusWithError(response: Response, error: unknown) {
        return `Response must have a 2xx status, given "${response.status}" (${response.statusText}) with content "${String(error)}".`
    },
    invalidResponseToken(responseBody: unknown) {
        return `Response must contain a token inside the JSON body, given "${responseBody}".`
    },
}

// Types ///////////////////////////////////////////////////////////////////////

export type AuthRequestOptions<A extends FnArgs = FnArgs, P extends object = {}> =
    Computable<
        RequestInit & P & {url: string},
        A
    >

export type AuthAuthenticateOptions = AuthRequestOptions<[AuthCredentials], {
    requestBody?: undefined | unknown
    responseError?: undefined | Fn<[body: unknown], undefined | string | unknown>
    responseToken?: undefined | Fn<[body: unknown], undefined | string>
}>

export type AuthValidateOptions = AuthRequestOptions<[token: string], {}>
export type AuthInvalidateOptions = AuthRequestOptions<[token: string], {}>

export interface AuthCredentials {
    identifier: string
    secret: string
}

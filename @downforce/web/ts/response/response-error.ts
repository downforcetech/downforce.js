import {isArray} from '@downforce/std/array'
import {decodeResponseBody} from './response-body.js'

export const ResponseErrorMonadTag = '@downforce/web/response/error'

export class ResponseErrorKit {
    static new(status: number, body: unknown): ResponseErrorMonad {
        return createResponseError(status, body)
    }

    static isError(value: unknown): value is ResponseError {
        return isResponseError(value)
    }
}

export function isResponseError(value: unknown): value is ResponseError {
    if (! isArray(value)) {
        return false
    }

    const [first, second, monadTag] = value

    return monadTag === ResponseErrorMonadTag
}

export function createResponseError(status: number, body: unknown): ResponseErrorMonad {
    return [status, body, ResponseErrorMonadTag]
}

/**
* @throws ResponseError
**/
export async function rejectResponseWhenError(responsePromise: Response | Promise<Response>): Promise<Response> {
    const response = await responsePromise

    try {
        return throwResponseWhenError(response)
    }
    catch {
        throw createResponseError(response.status, await decodeResponseBody(response))
    }
}

/**
* @throws Response
**/
export function throwResponseWhenError(response: Response): Response {
    if (! response.ok) {
        throw response
    }
    return response
}

// Types ///////////////////////////////////////////////////////////////////////

export type ResponseError = [status: number, body: unknown]
export type ResponseErrorMonad = [...ResponseError, monadTag: typeof ResponseErrorMonadTag]

import {isArray} from '@downforce/std/array'

export const ResponseErrorMonadTag = '@downforce/web/response:error'

export class ResponseErrorKit {
    static new(status: number, response: Response): ResponseErrorMonad {
        return createResponseError(status, response)
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

export function createResponseError(status: number, response: Response): ResponseErrorMonad {
    return [status, response, ResponseErrorMonadTag]
}

/**
* @throws [number, Response, string]
**/
export async function rejectResponseFailed(responsePromise: Response | Promise<Response>): Promise<Response> {
    const response = await responsePromise

    try {
        return throwResponseFailed(response)
    }
    catch {
        throw createResponseError(response.status, response)
    }
}

/**
* @throws Response
**/
export function throwResponseFailed(response: Response): Response {
    if (! response.ok) {
        throw response
    }
    return response
}

// Types ///////////////////////////////////////////////////////////////////////

export type ResponseError = [status: number, response: Response]
export type ResponseErrorMonad = [...ResponseError, monadTag: typeof ResponseErrorMonadTag]

import {decodeResponseBody} from './response-body.js'

/**
* @throws Response
**/
export async function rejectResponseWhenError(responsePromise: Response | Promise<Response>): Promise<Response> {
    const response = await responsePromise

    try {
        return throwResponseWhenError(response)
    }
    catch {
        throw [response.status, await decodeResponseBody(response)]
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

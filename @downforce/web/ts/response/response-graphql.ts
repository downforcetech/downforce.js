import {strictObject} from '@downforce/std/object'
import {decodeResponseBodyAsJson} from './response-body.js'

/**
* @throws
**/
export function decodeResponseBodyAsGraphql<V = unknown>(response: Response | Promise<Response>): Promise<V> {
    return Promise.resolve(response)
        .then(decodeResponseBodyAsJson)
        .then(it => strictObject(it)?.data as V)
}

import {cloneRequest, cloneRequestWithBody} from '../request/request-clone.js'

export const WebTypeClone: {
    cloneRequest: typeof cloneRequest
    cloneRequestWithBody: typeof cloneRequestWithBody
} = {
    cloneRequest: cloneRequest,
    cloneRequestWithBody: cloneRequestWithBody,
}

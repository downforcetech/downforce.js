import type {Options} from '@downforce/std/type'

export function cloneRequest(request: Request, options?: undefined | Options<RequestInit>): Request {
    return new Request(request, options as RequestInit)
}

export function cloneRequestWithBody(request: Request): Request {
    return request.clone()
}

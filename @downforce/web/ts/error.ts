import {throwError, StdError} from '@downforce/std/error'

export class InvalidResponse extends StdError {}

export function throwInvalidResponse(message?: undefined | string): never {
    return throwError(new InvalidResponse(message))
}

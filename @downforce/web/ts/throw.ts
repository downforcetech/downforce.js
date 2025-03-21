import {throwError, StdError} from '@downforce/std/throw'

export class InvalidResponse extends StdError {}

export function throwInvalidResponse(message?: undefined | string): never {
    return throwError(new InvalidResponse(message))
}

import {throwInvalidArgument} from '../error/error-new.js'
import {compute, type Computable} from '../fn/fn-compute.js'

/**
* @throws InvalidArgument
*/
export function whenBoolean<O1>(
    input: boolean,
    onTrue: Computable<O1, [true]>,
    onFalse?: undefined,
): O1 | undefined
export function whenBoolean<O1, O2>(
    input: boolean,
    onTrue: Computable<O1, [true]>,
    onFalse: Computable<O2, [false]>,
): O1 | O2
export function whenBoolean<O1, O2 = undefined>(
    input: boolean,
    onTrue: Computable<O1, [true]>,
    onFalse?: undefined | Computable<O2, [false]>,
): undefined | O1 | O2 {
    if (input === true) {
        return compute(onTrue, input)
    }
    if (input === false) {
        return compute(onFalse, input)
    }
    throwInvalidArgument(`unrecognized boolean input "${input}".`)
}

/**
* @throws InvalidArgument
*/
export const when: typeof whenBoolean = whenBoolean

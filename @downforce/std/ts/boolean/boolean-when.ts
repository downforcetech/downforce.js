import {throwInvalidArgument} from '../error/error-new.js'
import {compute, type Computable} from '../fn/fn-compute.js'

export function whenBoolean<TRUE, FALSE>(
    input: boolean,
    onTrue: Computable<TRUE, [true]>,
    onFalse: Computable<FALSE, [false]>,
): TRUE | FALSE {
    if (input === true) {
        return compute(onTrue, input)
    }
    if (input === false) {
        return compute(onFalse, input)
    }
    throwInvalidArgument(`unrecognized boolean input "${input}".`)
}

import type {Io} from '../fn.js'

export function whenBoolean<O1, O2>(input: boolean, onTrue: Io<true, O1>, onFalse: Io<false, O2>): O1 | O2 {
    return input
        ? onTrue(input)
        : onFalse(input)
}

import type {Io} from '../fn/fn-type.js'
import {whenBoolean} from './boolean-when.js'

export function matchingBoolean<O1, O2>(onTrue: Io<true, O1>, onFalse: Io<false, O2>): Io<boolean, O1 | O2> {
    return input => whenBoolean(input, onTrue, onFalse)
}

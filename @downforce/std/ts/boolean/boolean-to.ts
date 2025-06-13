import type {Io} from '../fn.js'
import {whenBoolean} from './boolean-when.js'

export function mapBooleanTo<O1, O2>(onTrue: Io<true, O1>, onFalse: Io<false, O2>): Io<boolean, O1 | O2> {
    return input => whenBoolean(input, onTrue, onFalse)
}

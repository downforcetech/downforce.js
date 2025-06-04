import type {Io} from '../fn.js'
import {mapBoolean} from './boolean-map.js'

export function mapBooleanTo<O1, O2>(onTrue: Io<true, O1>, onFalse: Io<false, O2>): Io<boolean, O1 | O2> {
    return input => mapBoolean(input, onTrue, onFalse)
}

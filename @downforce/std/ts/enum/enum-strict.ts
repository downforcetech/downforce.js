import type {None} from '../optional/optional-type.js'
import {trustEnum} from './enum-trust.js'

export function strictEnum<const E>(value: None | string, enumValues: Array<E>): undefined | E {
    return trustEnum(value, enumValues)
}

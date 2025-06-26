import type {None} from '../optional/optional-type.js'
import {trustEnum} from './enum-trust.js'

export function strictEnum<V extends E, E>(value: None | V, enumValues: Array<E>): undefined | V
export function strictEnum<V, E extends V>(value: V, enumValues: Array<E>): undefined | E
export function strictEnum(value: unknown, enumValues: Array<unknown>) {
    return trustEnum(value, enumValues)
}

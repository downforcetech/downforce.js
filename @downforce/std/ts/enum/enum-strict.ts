import type {None} from '../optional.js'
import {trustEnum} from './enum-trust.js'

export function strictEnum<E extends boolean | number | string, V extends E>(value: None | V, enumValues: Array<E>): undefined | V {
    return trustEnum(value, enumValues) as undefined | V
}

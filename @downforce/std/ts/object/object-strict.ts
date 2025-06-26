import type {None} from '../optional/optional-type.js'
import {trustObject} from './object-trust.js'

export function strictObject<V extends Record<PropertyKey, unknown>>(value: None | V): undefined | V {
    return trustObject(value) as undefined | V
}

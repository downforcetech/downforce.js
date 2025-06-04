import type {None} from '../optional.js'
import {isObject} from './object-is.js'

export function strictObject<V extends Record<PropertyKey, unknown>>(value: None | V): undefined | V
export function strictObject(value: unknown): undefined | Record<PropertyKey, unknown>
export function strictObject(value: unknown): undefined | Record<PropertyKey, unknown> {
    if (! isObject(value)) {
        return
    }
    return value
}

import type {None} from '../optional.js'
import {isArray} from './array-is.js'

export function strictArray<V extends Array<unknown>>(value: None | [...V] | readonly [...V]): undefined | V
export function strictArray(value: unknown): undefined | Array<unknown>
export function strictArray(value: unknown) {
    if (! isArray(value)) {
        return
    }
    return value
}

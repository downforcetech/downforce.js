import type {None} from '../optional/optional-type.js'
import {trustArray} from './array-trust.js'

export function strictArray<V extends Array<unknown>>(value: None | [...V] | readonly [...V]): undefined | V {
    return trustArray(value) as undefined | V
}

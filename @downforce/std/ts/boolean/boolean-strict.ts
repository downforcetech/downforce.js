import type {None} from '../optional/optional-type.js'
import {trustBoolean, trustBooleanLike} from './boolean-trust.js'

export function strictBoolean(value: None | boolean): undefined | boolean {
    return trustBoolean(value)
}

export function strictBooleanLike(value: None | boolean | number | string): undefined | boolean {
    return trustBooleanLike(value)
}

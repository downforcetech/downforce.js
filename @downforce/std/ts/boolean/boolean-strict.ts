import type {None} from '../optional.js'
import {trustBoolean, trustBooleanLike} from './boolean-trust.js'

export function strictBoolean(value: None | boolean): undefined | boolean {
    return trustBoolean(value)
}

export function strictBooleanLike(value: None | boolean): undefined | boolean {
    return trustBooleanLike(value)
}

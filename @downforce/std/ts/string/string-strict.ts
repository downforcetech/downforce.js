import {isBoolean} from '../boolean.js'
import {isNumber} from '../number.js'
import type {None} from '../optional.js'
import {isString} from './string-is.js'

export function strictString<const V extends string>(value: None | V): undefined | V
export function strictString(value: unknown): undefined | string
export function strictString(value: unknown) {
    if (isString(value)) {
        return value
    }
    return
}

export function strictStringNotEmpty(value: unknown): undefined | string {
    return strictString(value)?.trim() || undefined
}

export function strictStringLike(value: string | number | boolean): string
export function strictStringLike(value: unknown): undefined | string
export function strictStringLike(value: unknown) {
    if (isString(value)) {
        return value
    }
    if (isNumber(value)) {
        return String(value)
    }
    if (isBoolean(value)) {
        return String(value)
    }
    return
}

import type {None} from '../optional/optional-type.js'
import {trustString, trustStringLike, trustStringNotEmpty} from './string-trust.js'

export function strictString<const V extends string>(value: None | V): undefined | V {
    return trustString(value) as undefined | V
}

export function strictStringNotEmpty(value: None | string): undefined | string {
    return trustStringNotEmpty(value)
}

export function strictStringLike(value: string | number | boolean): string
export function strictStringLike(value: None | string | number | boolean): undefined | string
export function strictStringLike(value: None | string | number | boolean) {
    return trustStringLike(value)
}

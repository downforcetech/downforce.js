import type {None} from '../optional/optional-type.js'
import {trustInteger, trustIntegerLike, trustNumber, trustNumberLike} from './number-trust.js'

export function strictNumber<const V extends number>(value: None | V): undefined | V {
    return trustNumber(value) as undefined | V
}

export function strictNumberLike(value: None | number | string): undefined | number {
    return trustNumberLike(value)
}

export function strictInteger<const V extends number>(value: None | V): undefined | V {
    return trustInteger(value) as undefined | V
}

export function strictIntegerLike(value: None | number | string): undefined | number {
    return trustIntegerLike(value)
}

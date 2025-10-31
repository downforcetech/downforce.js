import {isString} from '../string/string-is.js'
import {isBoolean} from './boolean-is.js'

export const BooleanLikeTrue  = [true,  1, 'true',  '1', 'yes', 'on'] as const
export const BooleanLikeFalse = [false, 0, 'false', '0', 'no',  'off'] as const
export const BooleanLike = [...BooleanLikeTrue, ...BooleanLikeFalse] as [...typeof BooleanLikeTrue, ...typeof BooleanLikeFalse]

export function trustBoolean(value: unknown): undefined | boolean {
    if (! isBoolean(value)) {
        return
    }
    return value
}

export function trustBooleanLike(value: unknown): undefined | boolean {
    const valueLowercase = isString(value) ? value.toLowerCase() : value

    if (BooleanLikeTrue.includes(valueLowercase as any)) {
        return true
    }
    if (BooleanLikeFalse.includes(valueLowercase as any)) {
        return false
    }
    return
}

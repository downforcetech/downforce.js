import {isBoolean} from './boolean-is.js'

export const BooleanLikeTrue = [true, 1, '1', 'yes', 'on', 'true'] as const
export const BooleanLikeFalse = [false, 0, '0', 'no', 'off', 'false'] as const
export const BooleanLike = [...BooleanLikeTrue, ...BooleanLikeFalse] as [...typeof BooleanLikeTrue, ...typeof BooleanLikeFalse]

export function strictBoolean(value: unknown): undefined | boolean {
    if (! isBoolean(value)) {
        return
    }
    return value
}

export function strictBooleanLike(value: unknown): undefined | boolean {
    if (BooleanLikeTrue.includes(value as any)) {
        return true
    }
    if (BooleanLikeFalse.includes(value as any)) {
        return false
    }
    return
}

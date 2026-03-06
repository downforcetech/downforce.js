import {isString} from '../string/string-is.js'
import {isBoolean} from './boolean-is.js'
import {BooleanLikeFalse, BooleanLikeTrue} from './boolean-like.js'

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

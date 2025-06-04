import type {FnArgs} from './fn-type.js'

export function isFunction<O, A extends FnArgs, R>(value: O | ((...args: A) => R)): value is ((...args: A) => R)
export function isFunction(value: unknown): value is Function {
    if (! value) {
        return false
    }
    if (typeof value !== 'function') {
        return false
    }
    return true
}

import type {FnArgs} from './fn-type.js'

export function isFunction<O, A extends FnArgs, R>(value: O | ((...args: A) => R)): value is ((...args: A) => R)
export function isFunction(value: unknown): value is Function
export function isFunction(value: unknown): value is Function {
    // Classes are functions too.
    // typeof (class {}) === 'function'
    // We don't care about classes.
    return typeof value === 'function'
}

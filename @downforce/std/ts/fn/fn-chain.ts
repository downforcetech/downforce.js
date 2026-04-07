import type {Void} from '../type/type-type.js'
import {PartialApplication} from './fn-partial.js'
import type {Io} from './fn-type.js'

export function chain<I>(
    input: PartialApplication.Placeholder,
    ...args: Array<Io<I, Void>>
): Io<I, I>
export function chain<I>(
    input: I,
    ...args: Array<Io<I, Void>>
): I
export function chain<I>(
    input: I | PartialApplication.Placeholder,
    ...args: Array<Io<I, Void>>
): I | Io<I, I> {
    if (input === PartialApplication.Placeholder) {
        return (input: I) => chain(input, ...args)
    }

    for (const arg of args) {
        arg(input)
    }

    return input
}

export function _chain<I>(...args: Array<Io<I, Void>>): Io<I, I> {
    return (input: I) => chain(input, ...args)
}

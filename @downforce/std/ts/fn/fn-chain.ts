import type {Io} from './fn-type.js'

export function chain<I>(input: I, ...args: Array<Io<I, void>>): I {
    for (const arg of args) {
        arg(input)
    }

    return input
}

export function chaining<I>(...args: Array<Io<I, void>>): Io<I, I> {
    return (input: I) => chain(input, ...args)
}

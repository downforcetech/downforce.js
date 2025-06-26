import type {Io} from './fn-type.js'

export function chain<I>(input: I, ...args: Array<Io<I, void>>): I {
    for (const arg of args) {
        arg(input)
    }

    return input
}

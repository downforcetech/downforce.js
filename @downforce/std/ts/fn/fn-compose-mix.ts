import type {Io} from './fn-type.js'

export function computeComposition(stack: Array<Io<unknown, unknown>>, initialInput: unknown): unknown {
    return stack.reduce((input, fn) => fn(input), initialInput)
}

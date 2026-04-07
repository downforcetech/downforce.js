import {_pipe} from './fn-pipe.js'
import type {Io} from './fn-type.js'

export const compose: typeof _pipe = _pipe

export function composed<I, O>(fn: Io<I, O>): ComposeContinuation<I, O> {
    const stack: Array<IoGeneric> = []

    function continuation(fn?: undefined | Io<unknown, unknown>) {
        if (fn) {
            stack.push(fn as IoGeneric)

            return continuation
        }

        function compute(input: unknown): unknown {
            return stack.reduce((output, fn) => fn(output), input as unknown) as unknown
        }

        return compute
    }

    return continuation(fn as IoGeneric) as ComposeContinuation<I, O>
}

// Types ///////////////////////////////////////////////////////////////////////

type IoGeneric = Io<unknown, unknown>

export interface ComposeContinuation<I, O> {
    <O2>(fn: Io<O, O2>): ComposeContinuation<I, O2>
    (): Io<I, O>
}

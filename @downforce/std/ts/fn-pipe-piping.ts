import type {Io} from './fn-type.js'

export function piping(): PipeContinuation<undefined>
export function piping<I>(input: I): PipeContinuation<I>
export function piping<I>(input?: I): PipeContinuation<undefined | I> {
    function continuation(): undefined | I
    function continuation<O>(fn: Io<undefined | I, O>): PipeContinuation<O>
    function continuation<O>(fn?: Io<undefined | I, O>): undefined | I | PipeContinuation<O> {
        if (! fn) {
            return input
        }
        return piping(fn(input))
    }

    return continuation
}

// Types ///////////////////////////////////////////////////////////////////////

export interface PipeContinuation<I> {
    (): I
    <O>(fn: Io<I, O>): PipeContinuation<O>
}

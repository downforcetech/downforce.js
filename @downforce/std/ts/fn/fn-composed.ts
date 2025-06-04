import {computeComposition} from './fn-compose-mix.js'
import type {Io} from './fn-type.js'

export function composed<I, O = I>(fn: Io<I, O>): ComposeContinuation<I, O> {
    return createComposeContinuation<I, I, O>([], fn)
}

function createComposeContinuation<I, LastO>(stack: Array<Io<unknown, unknown>>): Io<I, LastO>
function createComposeContinuation<I, LastO>(stack: Array<Io<unknown, unknown>>, fn: undefined): Io<I, LastO>
function createComposeContinuation<I, LastO, CurrentO>(stack: Array<Io<unknown, unknown>>, fn: Io<LastO, CurrentO>): ComposeContinuation<I, CurrentO>
function createComposeContinuation<I, LastO, CurrentO>(stack: Array<Io<unknown, unknown>>, fn?: undefined | Io<LastO, CurrentO>): Io<I, LastO> | ComposeContinuation<I, CurrentO>
function createComposeContinuation<I, LastO, CurrentO>(stack: Array<Io<unknown, unknown>>, fn?: undefined | Io<LastO, CurrentO>): Io<I, LastO> | ComposeContinuation<I, CurrentO> {
    if (! fn) {
        function continuation(input: I): LastO {
            return computeComposition(stack, input) as LastO
        }

        return continuation
    }

    const nextStack = [...stack, fn as Io<unknown, unknown>]

    function continuation<NextO>(nextFn?: undefined | Io<CurrentO, NextO>) {
        return createComposeContinuation<I, CurrentO, NextO>(nextStack, nextFn)
    }

    return continuation as ComposeContinuation<I, CurrentO>
}

// Types ///////////////////////////////////////////////////////////////////////

export interface ComposeContinuation<I, LastO> {
    (): Io<I, LastO>
    <CurrentO>(fn: Io<LastO, CurrentO>): ComposeContinuation<I, CurrentO>
}

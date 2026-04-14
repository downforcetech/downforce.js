import {PartialApplication} from './fn-partial.js'
import type {Io} from './fn-type.js'

export function pipe<I>(input: $, ...args: []): Io<I, I>
export function pipe<I, O1>(input: $, ...args: [F<I, O1>]): Io<I, O1>
export function pipe<I, O1, O2>(input: $, ...args: [F<I, O1>, F<O1, O2>]): Io<I, O2>
export function pipe<I, O1, O2, O3>(input: $, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>]): Io<I, O3>
export function pipe<I, O1, O2, O3, O4>(input: $, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>]): Io<I, O4>
export function pipe<I, O1, O2, O3, O4, O5>(input: $, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>]): Io<I, O5>
export function pipe<I, O1, O2, O3, O4, O5, O6>(input: $, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>]): Io<I, O6>
export function pipe<I, O1, O2, O3, O4, O5, O6, O7>(input: $, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>]): Io<I, O7>
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8>(input: $, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>]): Io<I, O8>
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9>(input: $, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>]): Io<I, O9>
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10>(input: $, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>]): Io<I, O10>
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11>(input: $, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>]): Io<I, O11>
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12>(input: $, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>]): Io<I, O12>
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13>(input: $, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>, F<O12, O13>]): Io<I, O13>
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13, O14>(input: $, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>, F<O12, O13>, F<O13, O14>]): Io<I, O14>
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13, O14, O15>(input: $, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>, F<O12, O13>, F<O13, O14>, F<O14, O15>]): Io<I, O15>
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13, O14, O15, O16>(input: $, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>, F<O12, O13>, F<O13, O14>, F<O14, O15>, F<O15, O16>]): Io<I, O16>
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13, O14, O15, O16, O17>(input: $, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>, F<O12, O13>, F<O13, O14>, F<O14, O15>, F<O15, O16>, F<O16, O17>]): Io<I, O17>
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13, O14, O15, O16, O17, O18>(input: $, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>, F<O12, O13>, F<O13, O14>, F<O14, O15>, F<O15, O16>, F<O16, O17>, F<O17, O18>]): Io<I, O18>
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13, O14, O15, O16, O17, O18, O19>(input: $, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>, F<O12, O13>, F<O13, O14>, F<O14, O15>, F<O15, O16>, F<O16, O17>, F<O17, O18>, F<O18, O19>]): Io<I, O19>
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13, O14, O15, O16, O17, O18, O19, O20>(input: $, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>, F<O12, O13>, F<O13, O14>, F<O14, O15>, F<O15, O16>, F<O16, O17>, F<O17, O18>, F<O18, O19>, F<O19, O20>]): Io<I, O20>
export function pipe<I>(input: $, ...args: Array<F<I, I>>): Io<I, I>
export function pipe<I>(input: I, ...args: []): I
export function pipe<I, O1>(input: I, ...args: [F<I, O1>]): O1
export function pipe<I, O1, O2>(input: I, ...args: [F<I, O1>, F<O1, O2>]): O2
export function pipe<I, O1, O2, O3>(input: I, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>]): O3
export function pipe<I, O1, O2, O3, O4>(input: I, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>]): O4
export function pipe<I, O1, O2, O3, O4, O5>(input: I, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>]): O5
export function pipe<I, O1, O2, O3, O4, O5, O6>(input: I, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>]): O6
export function pipe<I, O1, O2, O3, O4, O5, O6, O7>(input: I, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>]): O7
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8>(input: I, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>]): O8
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9>(input: I, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>]): O9
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10>(input: I, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>]): O10
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11>(input: I, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>]): O11
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12>(input: I, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>]): O12
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13>(input: I, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>, F<O12, O13>]): O13
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13, O14>(input: I, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>, F<O12, O13>, F<O13, O14>]): O14
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13, O14, O15>(input: I, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>, F<O12, O13>, F<O13, O14>, F<O14, O15>]): O15
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13, O14, O15, O16>(input: I, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>, F<O12, O13>, F<O13, O14>, F<O14, O15>, F<O15, O16>]): O16
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13, O14, O15, O16, O17>(input: I, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>, F<O12, O13>, F<O13, O14>, F<O14, O15>, F<O15, O16>, F<O16, O17>]): O17
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13, O14, O15, O16, O17, O18>(input: I, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>, F<O12, O13>, F<O13, O14>, F<O14, O15>, F<O15, O16>, F<O16, O17>, F<O17, O18>]): O18
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13, O14, O15, O16, O17, O18, O19>(input: I, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>, F<O12, O13>, F<O13, O14>, F<O14, O15>, F<O15, O16>, F<O16, O17>, F<O17, O18>, F<O18, O19>]): O19
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13, O14, O15, O16, O17, O18, O19, O20>(input: I, ...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>, F<O12, O13>, F<O13, O14>, F<O14, O15>, F<O15, O16>, F<O16, O17>, F<O17, O18>, F<O18, O19>, F<O19, O20>]): O20
export function pipe<I>(input: I, ...args: Array<F<I, I>>): I
export function pipe<I>(input: I | PartialApplication.Placeholder, ...args: Array<IoGeneric>): unknown | Io<I, unknown> {
    if (input === PartialApplication.Placeholder) {
        return (input: I) => (pipe as PipeGeneric)(input, ...args)
    }

    return args.reduce((output, fn) => fn(output), input as unknown)
}

export function piped<I>(input: I): PipeContinuation<I> {
    function continuation<O>(fn?: undefined | Io<I, O>): PipeContinuation<O> | I {
        if (fn) {
            return piped(fn(input))
        }
        return input
    }

    return continuation as PipeContinuation<I>
}

export function Pipe<I>(input?: I): PipeFluent<I> {
    function createPipeLazy(
        stack: Array<IoGeneric>,
        compute: Io<Array<IoGeneric>, unknown>,
    ): PipeFluent<unknown> {
        return {
            to<O>(fn: Io<I, O>) {
                return createPipeLazy([...stack, fn as IoGeneric], compute) as PipeFluent<O>
            },
            get end() {
                return compute(stack)
            },
        }
    }

    function computeStackWithInput(stack: Array<IoGeneric>): unknown {
        return stack.reduce((output, fn) => fn(output), input as unknown)
    }

    return createPipeLazy([], computeStackWithInput) as PipeFluent<I>
}

export function _pipe<I>(...args: []): Io<I, I>
export function _pipe<I, O1>(...args: [F<I, O1>]): Io<I, O1>
export function _pipe<I, O1, O2>(...args: [F<I, O1>, F<O1, O2>]): Io<I, O2>
export function _pipe<I, O1, O2, O3>(...args: [F<I, O1>, F<O1, O2>, F<O2, O3>]): Io<I, O3>
export function _pipe<I, O1, O2, O3, O4>(...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>]): Io<I, O4>
export function _pipe<I, O1, O2, O3, O4, O5>(...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>]): Io<I, O5>
export function _pipe<I, O1, O2, O3, O4, O5, O6>(...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>]): Io<I, O6>
export function _pipe<I, O1, O2, O3, O4, O5, O6, O7>(...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>]): Io<I, O7>
export function _pipe<I, O1, O2, O3, O4, O5, O6, O7, O8>(...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>]): Io<I, O8>
export function _pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9>(...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>]): Io<I, O9>
export function _pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10>(...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>]): Io<I, O10>
export function _pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11>(...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>]): Io<I, O11>
export function _pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12>(...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>]): Io<I, O12>
export function _pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13>(...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>, F<O12, O13>]): Io<I, O13>
export function _pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13, O14>(...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>, F<O12, O13>, F<O13, O14>]): Io<I, O14>
export function _pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13, O14, O15>(...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>, F<O12, O13>, F<O13, O14>, F<O14, O15>]): Io<I, O15>
export function _pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13, O14, O15, O16>(...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>, F<O12, O13>, F<O13, O14>, F<O14, O15>, F<O15, O16>]): Io<I, O16>
export function _pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13, O14, O15, O16, O17>(...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>, F<O12, O13>, F<O13, O14>, F<O14, O15>, F<O15, O16>, F<O16, O17>]): Io<I, O17>
export function _pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13, O14, O15, O16, O17, O18>(...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>, F<O12, O13>, F<O13, O14>, F<O14, O15>, F<O15, O16>, F<O16, O17>, F<O17, O18>]): Io<I, O18>
export function _pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13, O14, O15, O16, O17, O18, O19>(...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>, F<O12, O13>, F<O13, O14>, F<O14, O15>, F<O15, O16>, F<O16, O17>, F<O17, O18>, F<O18, O19>]): Io<I, O19>
export function _pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10, O11, O12, O13, O14, O15, O16, O17, O18, O19, O20>(...args: [F<I, O1>, F<O1, O2>, F<O2, O3>, F<O3, O4>, F<O4, O5>, F<O5, O6>, F<O6, O7>, F<O7, O8>, F<O8, O9>, F<O9, O10>, F<O10, O11>, F<O11, O12>, F<O12, O13>, F<O13, O14>, F<O14, O15>, F<O15, O16>, F<O16, O17>, F<O17, O18>, F<O18, O19>, F<O19, O20>]): Io<I, O20>
export function _pipe<I>(...args: Array<F<I, I>>): Io<I, I>
export function _pipe<I>(...args: Array<IoGeneric>): Io<I, unknown> {
    return (input: I) => (pipe as PipeGeneric)(input, ...args)
}

// Types ///////////////////////////////////////////////////////////////////////

export interface PipeContinuation<I> {
    <O>(fn: Io<I, O>): PipeContinuation<O>
    (): I
}

export interface PipeFluent<I> {
    to<O>(fn: Io<I, O>): PipeFluent<O>
    end: I
}

type F<I,O> = Io<I,O>
type $ = PartialApplication.Placeholder
type IoGeneric = Io<unknown, unknown>
type PipeGeneric = (input: unknown, ...args: Array<IoGeneric>) => unknown

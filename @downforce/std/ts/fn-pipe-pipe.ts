import type {Io} from './fn-type.js'

export function pipe<I>(input: I): I
export function pipe<I>(input: I, ...fns: []): I
export function pipe<I, O1>(input: I, f1: Io<I, O1>): O1
export function pipe<I, O1, O2>(input: I, f1: Io<I, O1>, f2: Io<O1, O2>): O2
export function pipe<I, O1, O2, O3>(input: I, f1: Io<I, O1>, f2: Io<O1, O2>, f3: Io<O2, O3>): O3
export function pipe<I, O1, O2, O3, O4>(input: I, f1: Io<I, O1>, f2: Io<O1, O2>, f3: Io<O2, O3>, f4: Io<O3, O4>): O4
export function pipe<I, O1, O2, O3, O4, O5>(input: I, f1: Io<I, O1>, f2: Io<O1, O2>, f3: Io<O2, O3>, f4: Io<O3, O4>, f5: Io<O4, O5>): O5
export function pipe<I, O1, O2, O3, O4, O5, O6>(input: I, f1: Io<I, O1>, f2: Io<O1, O2>, f3: Io<O2, O3>, f4: Io<O3, O4>, f5: Io<O4, O5>, f6: Io<O5, O6>): O6
export function pipe<I, O1, O2, O3, O4, O5, O6, O7>(input: I, f1: Io<I, O1>, f2: Io<O1, O2>, f3: Io<O2, O3>, f4: Io<O3, O4>, f5: Io<O4, O5>, f6: Io<O5, O6>, f7: Io<O6, O7>): O7
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8>(input: I, f1: Io<I, O1>, f2: Io<O1, O2>, f3: Io<O2, O3>, f4: Io<O3, O4>, f5: Io<O4, O5>, f6: Io<O5, O6>, f7: Io<O6, O7>, f8: Io<O7, O8>): O8
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9>(input: I, f1: Io<I, O1>, f2: Io<O1, O2>, f3: Io<O2, O3>, f4: Io<O3, O4>, f5: Io<O4, O5>, f6: Io<O5, O6>, f7: Io<O6, O7>, f8: Io<O7, O8>, f9: Io<O8, O9>): O9
export function pipe<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10>(input: I, f1: Io<I, O1>, f2: Io<O1, O2>, f3: Io<O2, O3>, f4: Io<O3, O4>, f5: Io<O4, O5>, f6: Io<O5, O6>, f7: Io<O6, O7>, f8: Io<O7, O8>, f9: Io<O8, O9>, f10: Io<O9, O10>): O10
export function pipe<I>(input: I, ...fns: Array<Io<unknown, unknown>>): unknown {
    let result: unknown = input

    for (const fn of fns) {
        result = fn(result)
    }

    return result
}

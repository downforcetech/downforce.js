import {computeComposition} from './fn-compose-mix.js'
import type {Io} from './fn-type.js'

export function compose(): Io<void, void>
export function compose(...fns: []): Io<void, void>
export function compose<I, O1>(f1: Io<I, O1>): Io<I, O1>
export function compose<I, O1, O2>(f1: Io<I, O1>, f2: Io<O1, O2>): Io<I, O2>
export function compose<I, O1, O2, O3>(f1: Io<I, O1>, f2: Io<O1, O2>, f3: Io<O2, O3>): Io<I, O3>
export function compose<I, O1, O2, O3, O4>(f1: Io<I, O1>, f2: Io<O1, O2>, f3: Io<O2, O3>, f4: Io<O3, O4>): Io<I, O4>
export function compose<I, O1, O2, O3, O4, O5>(f1: Io<I, O1>, f2: Io<O1, O2>, f3: Io<O2, O3>, f4: Io<O3, O4>, f5: Io<O4, O5>): Io<I, O5>
export function compose<I, O1, O2, O3, O4, O5, O6>(f1: Io<I, O1>, f2: Io<O1, O2>, f3: Io<O2, O3>, f4: Io<O3, O4>, f5: Io<O4, O5>, f6: Io<O5, O6>): Io<I, O6>
export function compose<I, O1, O2, O3, O4, O5, O6, O7>(f1: Io<I, O1>, f2: Io<O1, O2>, f3: Io<O2, O3>, f4: Io<O3, O4>, f5: Io<O4, O5>, f6: Io<O5, O6>, f7: Io<O6, O7>): Io<I, O7>
export function compose<I, O1, O2, O3, O4, O5, O6, O7, O8>(f1: Io<I, O1>, f2: Io<O1, O2>, f3: Io<O2, O3>, f4: Io<O3, O4>, f5: Io<O4, O5>, f6: Io<O5, O6>, f7: Io<O6, O7>, f8: Io<O7, O8>): Io<I, O8>
export function compose<I, O1, O2, O3, O4, O5, O6, O7, O8, O9>(f1: Io<I, O1>, f2: Io<O1, O2>, f3: Io<O2, O3>, f4: Io<O3, O4>, f5: Io<O4, O5>, f6: Io<O5, O6>, f7: Io<O6, O7>, f8: Io<O7, O8>, f9: Io<O8, O9>): Io<I, O9>
export function compose<I, O1, O2, O3, O4, O5, O6, O7, O8, O9, O10>(f1: Io<I, O1>, f2: Io<O1, O2>, f3: Io<O2, O3>, f4: Io<O3, O4>, f5: Io<O4, O5>, f6: Io<O5, O6>, f7: Io<O6, O7>, f8: Io<O7, O8>, f9: Io<O8, O9>, f10: Io<O9, O10>): Io<I, O10>
export function compose<I>(...fns: Array<Io<unknown, unknown>>): unknown {
    function continuation(input: I): unknown {
        return computeComposition(fns, input)
    }

    return continuation
}

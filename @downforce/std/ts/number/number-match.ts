import {throwInvalidArgument} from '../error/error-new.js'
import {compute, type Computable} from '../fn/fn-compute.js'
import {PartialApplication} from '../fn/fn-partial.js'
import type {Io} from '../fn/fn-type.js'
import type {IfAnyOrUnknown} from '../type/type-type.js'
import {isNumber} from './number-is.js'

export function matchNumber<I, O1, O2 = Exclude<I, number>>(
    input: PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, number, Extract<I, number>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, number>>, O2>,
): Io<I, O1 | O2>
export function matchNumber<I, O1, O2 = Exclude<I, number>>(
    input: I,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, number, Extract<I, number>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, number>>, O2>,
): O1 | O2
export function matchNumber<I, O1, O2 = Exclude<I, number>>(
    input: I | PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, number, Extract<I, number>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, number>>, O2>,
): O1 | O2 | Io<I, O1 | O2> {
    if (input === PartialApplication.Placeholder) {
        return (input: I) => matchNumber(input, onMatch, onElse)
    }

    if (isNumber(input)) {
        return onMatch(input as Extract<I, number> & number)
    }
    if (onElse) {
        return onElse(input as Exclude<I, number>)
    }
    return input as unknown as O2
}

export function matchNumberBy2<const EVEN, const ODD>(input: number, args: {
    even: Computable<EVEN, [number]>
    odd: Computable<ODD, [number]>
}): EVEN | ODD {
    return (input % 2 === 0)
        ? compute(args.even, input)
        : compute(args.odd, input)
}

/**
* See Math.sign() too.
*/
export function matchNumberSign<const POSITIVE, const NEGATIVE, const ZERO>(input: number, args: {
    positive: Computable<POSITIVE, [number]>
    negative: Computable<NEGATIVE, [number]>
    zero: Computable<ZERO, [number]>
}): POSITIVE | NEGATIVE | ZERO {
    // Sorted by probability of occurrence.
    if (input > 0) {
        return compute(args.positive, input)
    }
    if (input === 0) {
        return compute(args.zero, input)
    }
    if (input < 0) {
        return compute(args.negative, input)
    }
    throwInvalidArgument(`unrecognized number sign for "${input}".`)
}

export function matchNumberCount<const NEGATIVE, const ZERO, const ONE, const MANY>(input: number, args: {
    negative: Computable<NEGATIVE, [number]>
    zero: Computable<ZERO, [number]>
    one: Computable<ONE, [number]>
    many: Computable<MANY, [number]>
}): NEGATIVE | ZERO | ONE | MANY {
    // Sorted by probability of occurrence.
    if (input >= 2) {
        return compute(args.many, input)
    }
    if (input === 1) {
        return compute(args.one, input)
    }
    if (input === 0) {
        return compute(args.zero, input)
    }
    if (input < 0) {
        return compute(args.negative, input)
    }
    throwInvalidArgument(`unrecognized number count (negative/zero/one/many) for "${input}".`)
}

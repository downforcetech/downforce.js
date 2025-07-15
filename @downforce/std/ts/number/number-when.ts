import {throwUnexpectedCondition} from '../error/error-new.js'
import {compute, type Computable} from '../fn/fn-compute.js'

export function whenNumberBy2<const EVEN, const ODD>(input: number, args: {
    even: Computable<EVEN, [number]>
    odd: Computable<ODD, [number]>
}): EVEN | ODD {
    if (input % 2 === 0) {
        return compute(args.even, input)
    }
    if (input % 2 !== 0) {
        return compute(args.odd, input)
    }
    throwUnexpectedCondition(`unrecognized number kind (even/odd) for "${input}".`)
}

/**
* See Math.sign() too.
*/
export function whenNumberSign<const POSITIVE, const NEGATIVE, const ZERO>(input: number, args: {
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
    throwUnexpectedCondition(`unrecognized number sign for "${input}".`)
}

export function whenNumberCount<const NEGATIVE, const ZERO, const ONE, const MANY>(input: number, args: {
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
    throwUnexpectedCondition(`unrecognized number count (negative/zero/one/many) for "${input}".`)
}

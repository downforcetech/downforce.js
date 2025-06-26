import type {Io} from '../fn/fn-type.js'

/**
* See Math.sign() too.
*/
export function whenSign<P, N, Z>(
    value: number,
    onPositive: Io<number, P>,
    onNegative: Io<number, N>,
    onZero: Io<number, Z>,
): P | N | Z {
    if (value > 0) {
        return onPositive(value)
    }
    if (value < 0) {
        return onNegative(value)
    }
    return onZero(value)
}

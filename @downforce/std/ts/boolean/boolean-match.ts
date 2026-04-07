import {compute, type Computable} from '../fn/fn-compute.js'
import {PartialApplication} from '../fn/fn-partial.js'
import type {Io} from '../fn/fn-type.js'
import type {IfAnyOrUnknown} from '../type/type-type.js'
import {isBoolean} from './boolean-is.js'
import type {Falsy} from './boolean-type.js'

export function matchBoolean<I, O1, O2 = Exclude<I, boolean>>(
    input: PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, boolean, Extract<I, boolean>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, boolean>>, O2>,
): Io<I, O1 | O2>
export function matchBoolean<I, O1, O2 = Exclude<I, boolean>>(
    input: I,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, boolean, Extract<I, boolean>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, boolean>>, O2>,
): O1 | O2
export function matchBoolean<I, O1, O2 = Exclude<I, boolean>>(
    input: I | PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, boolean, Extract<I, boolean>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, boolean>>, O2>,
): O1 | O2 | Io<I, O1 | O2> {
    if (input === PartialApplication.Placeholder) {
        return (input: I) => matchBoolean(input, onMatch, onElse)
    }

    if (isBoolean(input)) {
        return onMatch(input as IfAnyOrUnknown<I, boolean, Extract<I, boolean>>)
    }
    if (onElse) {
        return onElse(input as Exclude<I, boolean>)
    }
    return input as unknown as O2
}

export function matchTrueFalse<O1, O2>(
    input: PartialApplication.Placeholder,
    onTrue: Io<true, O1>,
    onFalse: Io<false, O2>,
): Io<boolean, O1 | O2>
export function matchTrueFalse<O1, O2>(
    input: boolean,
    onTrue: Io<true, O1>,
    onFalse: Io<false, O2>,
): O1 | O2
export function matchTrueFalse<I, O1, O2>(
    input: boolean | PartialApplication.Placeholder,
    onTrue: Io<true, O1>,
    onFalse: Io<false, O2>,
): O1 | O2 | Io<boolean, O1 | O2> {
    if (input === PartialApplication.Placeholder) {
        return (input: boolean) => matchTrueFalse(input, onTrue, onFalse)
    }

    return input
        ? onTrue(input)
        : onFalse(input)
}

export function when<I, O1>(
    input: I,
    onTrue: Computable<O1, [Exclude<I, Falsy>]>,
): O1 | undefined
export function when<I, O1, O2>(
    input: I,
    onTrue: Computable<O1, [Exclude<I, Falsy>]>,
    onFalse: Computable<O2, [Extract<I, Falsy>]>,
): O1 | O2
export function when<I, O1, O2 = undefined>(
    input: I,
    onTrue: Computable<O1, [Exclude<I, Falsy>]>,
    onFalse?: undefined | Computable<O2, [Extract<I, Falsy>]>,
): undefined | O1 | O2 {
    return Boolean(input)
        ? compute(onTrue, input as Exclude<I, Falsy>)
        : compute(onFalse, input as Extract<I, Falsy>)
}

export function _matchTrueFalse<O1, O2>(onTrue: Io<true, O1>, onFalse: Io<false, O2>): Io<boolean, O1 | O2> {
    return input => matchTrueFalse(input, onTrue, onFalse)
}

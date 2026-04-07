import type {IfAnyOrUnknown} from '../type/type-type.js'
import {isFunction} from './fn-is.js'
import {PartialApplication} from './fn-partial.js'
import type {Io} from './fn-type.js'

export function matchFunction<I, O1, O2 = Exclude<I, Function>>(
    input: PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, Function, Extract<I, Function>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, Function>>, O2>,
): Io<I, O1 | O2>
export function matchFunction<I, O1, O2 = Exclude<I, Function>>(
    input: I,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, Function, Extract<I, Function>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, Function>>, O2>,
): O1 | O2
export function matchFunction<I, O1, O2 = Exclude<I, Function>>(
    input: I | PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, Function, Extract<I, Function>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, Function>>, O2>,
): O1 | O2 | Io<I, O1 | O2> {
    if (input === PartialApplication.Placeholder) {
        return (input: I) => matchFunction(input, onMatch, onElse)
    }

    if (isFunction(input)) {
        return onMatch(input as IfAnyOrUnknown<I, Function, Extract<I, Function>>)
    }
    if (onElse) {
        return onElse(input as Exclude<I, Function>)
    }
    return input as unknown as O2
}

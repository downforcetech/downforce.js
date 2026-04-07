import {PartialApplication} from '../fn/fn-partial.js'
import type {Io} from '../fn/fn-type.js'
import type {IfAnyOrUnknown} from '../type/type-type.js'
import {isArray} from './array-is.js'

export function matchArray<I, O1, O2 = Exclude<I, Array<unknown>>>(
    input: PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, Array<unknown>, Extract<I, Array<unknown>>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, Array<unknown>>>, O2>,
): Io<I, O1 | O2>
export function matchArray<I, O1, O2 = Exclude<I, Array<unknown>>>(
    input: I,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, Array<unknown>, Extract<I, Array<unknown>>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, Array<unknown>>>, O2>,
): O1 | O2
export function matchArray<I, O1, O2 = Exclude<I, Array<unknown>>>(
    input: I | PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, Array<unknown>, Extract<I, Array<unknown>>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, Array<unknown>>>, O2>,
): O1 | O2 | Io<I, O1 | O2> {
    if (input === PartialApplication.Placeholder) {
        return (input: I) => matchArray(input, onMatch, onElse)
    }

    if (isArray(input)) {
        return onMatch(input as IfAnyOrUnknown<I, Array<unknown>, Extract<I, Array<unknown>>>)
    }
    if (onElse) {
        return onElse(input as Exclude<I, Array<unknown>>)
    }
    return input as unknown as O2
}

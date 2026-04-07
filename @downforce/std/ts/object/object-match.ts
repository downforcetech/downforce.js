import {PartialApplication} from '../fn/fn-partial.js'
import type {Io} from '../fn/fn-type.js'
import type {IfAnyOrUnknown} from '../type/type-type.js'
import {isObject} from './object-is.js'

export function matchObject<I, O1, O2 = Exclude<I, Record<PropertyKey, unknown>>>(
    input: PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, Record<PropertyKey, unknown>, Extract<I, Record<PropertyKey, unknown>>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, Record<PropertyKey, unknown>>>, O2>,
): Io<I, O1 | O2>
export function matchObject<I, O1, O2 = Exclude<I, Record<PropertyKey, unknown>>>(
    input: I,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, Record<PropertyKey, unknown>, Extract<I, Record<PropertyKey, unknown>>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, Record<PropertyKey, unknown>>>, O2>,
): O1 | O2
export function matchObject<I, O1, O2 = Exclude<I, Record<PropertyKey, unknown>>>(
    input: I | PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, Record<PropertyKey, unknown>, Extract<I, Record<PropertyKey, unknown>>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, Record<PropertyKey, unknown>>>, O2>,
): O1 | O2 | Io<I, O1 | O2> {
    if (input === PartialApplication.Placeholder) {
        return (input: I) => matchObject(input, onMatch, onElse)
    }

    if (isObject(input)) {
        return onMatch(input as IfAnyOrUnknown<I, Record<PropertyKey, unknown>, Extract<I, Record<PropertyKey, unknown>>>)
    }
    if (onElse) {
        return onElse(input as Exclude<I, Record<PropertyKey, unknown>>)
    }
    return input as unknown as O2
}

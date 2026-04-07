import {PartialApplication} from '../fn/fn-partial.js'
import type {Io} from '../fn/fn-type.js'
import type {IfAnyOrUnknown} from '../type/type-type.js'
import {isString} from './string-is.js'

export function matchString<I, O1, O2 = Exclude<I, string>>(
    input: PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, string, Extract<I, string>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, string>>, O2>,
): Io<I, O1 | O2>
export function matchString<I, O1, O2 = Exclude<I, string>>(
    input: I,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, string, Extract<I, string>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, string>>, O2>,
): O1 | O2
export function matchString<I, O1, O2 = Exclude<I, string>>(
    input: I | PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, string, Extract<I, string>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, string>>, O2>,
): O1 | O2 | Io<I, O1 | O2> {
    if (input === PartialApplication.Placeholder) {
        return (input: I) => matchString(input, onMatch, onElse)
    }

    if (isString(input)) {
        return onMatch(input as IfAnyOrUnknown<I, string, Extract<I, string>>)
    }
    if (onElse) {
        return onElse(input as Exclude<I, string>)
    }
    return input as unknown as O2
}

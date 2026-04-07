import {PartialApplication} from '../fn/fn-partial.js'
import type {Io} from '../fn/fn-type.js'
import type {IfAnyOrUnknown} from '../type/type-type.js'
import {isDate} from './date-is.js'

export function matchDate<I, O1, O2 = Exclude<I, Date>>(
    input: PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, Date, Extract<I, Date>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, Date>>, O2>,
): Io<I, O1 | O2>
export function matchDate<I, O1, O2 = Exclude<I, Date>>(
    input: I,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, Date, Extract<I, Date>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, Date>>, O2>,
): O1 | O2
export function matchDate<I, O1, O2 = Exclude<I, Date>>(
    input: I | PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, Date, Extract<I, Date>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, Date>>, O2>,
): O1 | O2 | Io<I, O1 | O2> {
    if (input === PartialApplication.Placeholder) {
        return (input: I) => matchDate(input, onMatch, onElse)
    }

    if (isDate(input)) {
        return onMatch(input as IfAnyOrUnknown<I, Date, Extract<I, Date>>)
    }
    if (onElse) {
        return onElse(input as Exclude<I, Date>)
    }
    return input as unknown as O2
}

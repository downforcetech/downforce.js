import {PartialApplication} from '../fn/fn-partial.js'
import type {Io} from '../fn/fn-type.js'
import type {IfAnyOrUnknown} from '../type/type-type.js'
import {isRegExp} from './regexp-is.js'

export function matchRegExp<I, O1, O2 = Exclude<I, RegExp>>(
    input: PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, RegExp, Extract<I, RegExp>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, RegExp>>, O2>,
): Io<I, O1 | O2>
export function matchRegExp<I, O1, O2 = Exclude<I, RegExp>>(
    input: I,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, RegExp, Extract<I, RegExp>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, RegExp>>, O2>,
): O1 | O2
export function matchRegExp<I, O1, O2 = Exclude<I, RegExp>>(
    input: I | PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, RegExp, Extract<I, RegExp>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, RegExp>>, O2>,
): O1 | O2 | Io<I, O1 | O2> {
    if (input === PartialApplication.Placeholder) {
        return (input: I) => matchRegExp(input, onMatch, onElse)
    }

    if (isRegExp(input)) {
        return onMatch(input as IfAnyOrUnknown<I, RegExp, Extract<I, RegExp>>)
    }
    if (onElse) {
        return onElse(input as Exclude<I, RegExp>)
    }
    return input as unknown as O2
}

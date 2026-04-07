import {PartialApplication} from '../fn/fn-partial.js'
import type {IfAnyOrUnknown} from '../type/type-type.js'
import type {Io} from '../fn/fn-type.js'
import {isSymbol} from './symbol-is.js'

export function matchSymbol<I, O1, O2 = Exclude<I, symbol>>(
    input: PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, symbol, Extract<I, symbol>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, symbol>>, O2>,
): Io<I, O1 | O2>
export function matchSymbol<I, O1, O2 = Exclude<I, symbol>>(
    input: I,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, symbol, Extract<I, symbol>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, symbol>>, O2>,
): O1 | O2
export function matchSymbol<I, O1, O2 = Exclude<I, symbol>>(
    input: I | PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, symbol, Extract<I, symbol>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, symbol>>, O2>,
): O1 | O2 | Io<I, O1 | O2> {
    if (input === PartialApplication.Placeholder) {
        return (input: I) => matchSymbol(input, onMatch, onElse)
    }

    if (isSymbol(input)) {
        return onMatch(input as IfAnyOrUnknown<I, symbol, Extract<I, symbol>>)
    }
    if (onElse) {
        return onElse(input as Exclude<I, symbol>)
    }
    return input as unknown as O2
}

import {PartialApplication} from '../fn/fn-partial.js'
import type {Io} from '../fn/fn-type.js'
import type {IfAnyOrUnknown} from '../type/type-type.js'
import {isNone, isNull, isSome, isUndefined} from './optional-is.js'
import type {None, Some} from './optional-type.js'

export function matchOptional<I, O1, O2>(
    input: PartialApplication.Placeholder,
    onSome: Io<NoInfer<Some<I>>, O1>,
    onNone: Io<NoInfer<Extract<I, void | None>>, O2>,
): Io<I, O1 | O2>
export function matchOptional<I, O1, O2>(
    input: I,
    onSome: Io<NoInfer<Some<I>>, O1>,
    onNone: Io<NoInfer<Extract<I, void | None>>, O2>,
): O1 | O2
export function matchOptional<I, O1, O2>(
    input: I | PartialApplication.Placeholder,
    onSome: Io<NoInfer<Some<I>>, O1>,
    onNone: Io<NoInfer<Extract<I, void | None>>, O2>,
): O1 | O2 | Io<I, O1 | O2> {
    if (input === PartialApplication.Placeholder) {
        return (input: I) => matchOptional(input, onSome, onNone)
    }

    return isSome(input)
        ? onSome(input as Some<I>)
        : onNone(input as Extract<I, void | None>)
}

export function matchSome<I, O1, O2 = Extract<I, void | None>>(
    input: PartialApplication.Placeholder,
    onMatch: Io<NoInfer<Some<I>>, O1>,
    onElse?: undefined | Io<NoInfer<IfAnyOrUnknown<I, None, Extract<I, void | None>>>, O2>,
): Io<I, O1 | O2>
export function matchSome<I, O1, O2 = Extract<I, void | None>>(
    input: I,
    onMatch: Io<NoInfer<Some<I>>, O1>,
    onElse?: undefined | Io<NoInfer<IfAnyOrUnknown<I, None, Extract<I, void | None>>>, O2>,
): O1 | O2
export function matchSome<I, O1, O2 = Extract<I, void | None>>(
    input: I | PartialApplication.Placeholder,
    onMatch: Io<NoInfer<Some<I>>, O1>,
    onElse?: undefined | Io<NoInfer<IfAnyOrUnknown<I, None, Extract<I, void | None>>>, O2>,
): O1 | O2 | Io<I, O1 | O2> {
    if (input === PartialApplication.Placeholder) {
        return (input: I) => matchSome(input, onMatch, onElse)
    }

    if (isSome(input)) {
        return onMatch(input as Some<I>)
    }
    if (onElse) {
        return onElse(input as IfAnyOrUnknown<I, None, Extract<I, void | None>>)
    }
    return input as unknown as O2
}

export function matchNone<I, O1, O2 = Some<I>>(
    input: PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, None, Extract<I, void | None>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, void | None>>, O2>,
): Io<I, O1 | O2>
export function matchNone<I, O1, O2 = Some<I>>(
    input: I,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, None, Extract<I, void | None>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, void | None>>, O2>,
): O1 | O2
export function matchNone<I, O1, O2 = Some<I>>(
    input: I | PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, None, Extract<I, void | None>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, void | None>>, O2>,
): O1 | O2 | Io<I, O1 | O2> {
    if (input === PartialApplication.Placeholder) {
        return (input: I) => matchNone(input, onMatch, onElse)
    }

    if (isNone(input)) {
        return onMatch(input as IfAnyOrUnknown<I, None, Extract<I, void | None>>)
    }
    if (onElse) {
        return onElse(input as Exclude<I, void | None>)
    }
    return input as unknown as O2
}

export function matchNull<I, O1, O2 = Exclude<I, null>>(
    input: PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, null, Extract<I, null>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, null>>, O2>,
): Io<I, O1 | O2>
export function matchNull<I, O1, O2 = Exclude<I, null>>(
    input: I,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, null, Extract<I, null>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, null>>, O2>,
): O1 | O2
export function matchNull<I, O1, O2 = Exclude<I, null>>(
    input: I | PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, null, Extract<I, null>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, null>>, O2>,
): O1 | O2 | Io<I, O1 | O2> {
    if (input === PartialApplication.Placeholder) {
        return (input: I) => matchNull(input, onMatch, onElse)
    }

    if (isNull(input)) {
        return onMatch(input as IfAnyOrUnknown<I, null, Extract<I, null>>)
    }
    if (onElse) {
        return onElse(input as Exclude<I, null>)
    }
    return input as unknown as O2
}

export function matchUndefined<I, O1, O2 = Exclude<I, void | undefined>>(
    input: PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, undefined, Extract<I, undefined>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, void | undefined>>, O2>,
): Io<I, O1 | O2>
export function matchUndefined<I, O1, O2 = Exclude<I, void | undefined>>(
    input: I,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, undefined, Extract<I, undefined>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, void | undefined>>, O2>,
): O1 | O2
export function matchUndefined<I, O1, O2 = Exclude<I, void | undefined>>(
    input: I | PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, undefined, Extract<I, undefined>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, void | undefined>>, O2>,
): O1 | O2 | Io<I, O1 | O2> {
    if (input === PartialApplication.Placeholder) {
        return (input: I) => matchUndefined(input, onMatch, onElse)
    }

    if (isUndefined(input)) {
        return onMatch(input as IfAnyOrUnknown<I, undefined, Extract<I, undefined>>)
    }
    if (onElse) {
        return onElse(input as Exclude<I, void | undefined>)
    }
    return input as unknown as O2
}

export function _matchOptional<I, O1, O2>(
    onSome: Io<NoInfer<Some<I>>, O1>,
    onNone: Io<NoInfer<Extract<I, void | None>>, O2>,
): Io<I, O1 | O2> {
    return (input: I) => matchOptional(input, onSome, onNone)
}

export function _matchSome<I, O1, O2 = Extract<I, void | None>>(
    onMatch: Io<NoInfer<Some<I>>, O1>,
    onElse?: undefined | Io<NoInfer<IfAnyOrUnknown<I, None, Extract<I, void | None>>>, O2>,
): Io<I, O1 | O2> {
    return (input: I) => matchSome(input, onMatch, onElse)
}

export function _matchNone<I, O1, O2 = Some<I>>(
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, None, Extract<I, void | None>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, void | None>>, O2>,
): Io<I, O1 | O2> {
    return (input: I) => matchNone(input, onMatch, onElse)
}

export function _matchNull<I, O1, O2 = Exclude<I, null>>(
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, null, Extract<I, null>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, null>>, O2>,
): Io<I, O1 | O2> {
    return (input: I) => matchNull(input, onMatch, onElse)
}

export function _matchUndefined<I, O1, O2 = Exclude<I, void | undefined>>(
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, undefined, Extract<I, undefined>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, void | undefined>>, O2>,
): Io<I, O1 | O2> {
    return (input: I) => matchUndefined(input, onMatch, onElse)
}

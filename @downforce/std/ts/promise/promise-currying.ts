import type {Io} from '../fn/fn-type.js'
import type {None} from '../optional/optional-type.js'
import {Error} from '../outcome/outcome-new.js'
import type {OutcomeError} from '../outcome/outcome-type.js'

export function awaiting<I, O>(
    onThen: Io<I, O | Promise<O>>,
): Io<Promise<I>, Promise<O>>
export function awaiting<I, O1, O2>(
    onThen: Io<I, O1 | Promise<O1>>,
    onCatch: Io<unknown, O2 | Promise<O2>>,
    onFinally?: undefined | Io<void, void>,
): Io<Promise<I>, Promise<O1 | O2>>
export function awaiting<I, O1, O2>(
    onThen: Io<I, O1 | Promise<O1>>,
    onCatch?: undefined | Io<unknown, O2 | Promise<O2>>,
    onFinally?: undefined | Io<void, void>,
): Io<Promise<I>, Promise<O1 | O2>> {
    return ! onCatch
        ? (input: Promise<I>) => input.then(onThen)
        : (input: Promise<I>) => input.then(onThen).catch(onCatch).finally(onFinally)
}

/*
* Utility API, mapping the rejection.
*/
export function catching<I, O>(onCatch: Io<unknown, O | Promise<O>>): Io<Promise<I>, Promise<I | O>> {
    return (input: Promise<I>) => input.catch(onCatch)
}

/*
* Shortcut API. Same of catching(Error).
*/
export function catchingError<I>(errorOptional?: None | never): Io<Promise<I>, Promise<I | OutcomeError<unknown>>>
export function catchingError<I, const O>(errorOptional: O): Io<Promise<I>, Promise<I | OutcomeError<O>>>
export function catchingError<I, const O>(errorOptional?: O): Io<Promise<I>, Promise<I | OutcomeError<O>>> {
    return (input: Promise<I>) => input.catch(error => Error(errorOptional ?? error))
}

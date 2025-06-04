import type {Io} from '../fn.js'
import type {None} from '../optional.js'
import {Error, type OutcomeError} from '../outcome.js'

/*
* The safest API, requiring to handle the error.
*/
export function mapPromiseTo<I, O1, O2>(
    onThen: Io<I, O1 | Promise<O1>>,
    onCatch: Io<unknown, O2 | Promise<O2>>,
): Io<Promise<I>, Promise<O1 | O2>> {
    return (input: Promise<I>) => input.then(onThen).catch(onCatch)
}

/*
* Sugar API, for easy prototyping.
*/
export function thenTo<I, O1>(onThen: Io<I, O1 | Promise<O1>>, onCatch?: never): Io<Promise<I>, Promise<O1>>
export function thenTo<I, O1, O2>(onThen: Io<I, O1 | Promise<O1>>, onCatch: Io<unknown, O2 | Promise<O2>>): Io<Promise<I>, Promise<O1 | O2>>
export function thenTo<I, O1, O2>(onThen: Io<I, O1 | Promise<O1>>, onCatch?: Io<unknown, O2 | Promise<O2>>): Io<Promise<I>, Promise<O1 | O2>> {
    return ! onCatch
        ? (input: Promise<I>) => input.then(onThen)
        : (input: Promise<I>) => input.then(onThen).catch(onCatch)
}

/*
* Utility API, mapping the rejection.
*/
export function catchTo<I, O>(onCatch: Io<unknown, O | Promise<O>>): Io<Promise<I>, Promise<I | O>> {
    return (input: Promise<I>) => input.catch(onCatch)
}

/*
* Shortcut API. Same of catching(Error).
*/
export function catchErrorTo<I>(errorOptional?: None | never): Io<Promise<I>, Promise<I | OutcomeError<unknown>>>
export function catchErrorTo<I, const O>(errorOptional: O): Io<Promise<I>, Promise<I | OutcomeError<O>>>
export function catchErrorTo<I, const O>(errorOptional?: O): Io<Promise<I>, Promise<I | OutcomeError<O>>> {
    return (input: Promise<I>) => input.catch(error => Error(errorOptional ?? error))
}

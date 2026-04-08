import {PartialApplication} from '../fn/fn-partial.js'
import type {Io, Task} from '../fn/fn-type.js'
import type {IfAnyOrUnknown} from '../type/type-type.js'
import {isPromise} from './promise-is.js'

// We can't use NoInfer<I> on Partial Application functions definitions
// because it prevents inference when multiple partial application functions
// are combined.
// EXAMPLE
//   pipe(
//     input,
//     _thenPromise(_matchResult(it => it)), // 'it' would be 'never' with 'NoInfer<I>'.
//   )

export function matchPromise<I, O1, O2 = Exclude<I, Promise<unknown>>>(
    input: PartialApplication.Placeholder,
    onMatch: Io<IfAnyOrUnknown<I, Promise<unknown>, Extract<I, Promise<unknown>>>, O1>,
    onElse?: undefined | Io<Exclude<I, Promise<unknown>>, O2>,
): Io<I, O1 | O2>
export function matchPromise<I, O1, O2 = Exclude<I, Promise<unknown>>>(
    input: I,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, Promise<unknown>, Extract<I, Promise<unknown>>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, Promise<unknown>>>, O2>,
): O1 | O2
export function matchPromise<I, O1, O2 = Exclude<I, Promise<unknown>>>(
    input: I | PartialApplication.Placeholder,
    onMatch: Io<NoInfer<IfAnyOrUnknown<I, Promise<unknown>, Extract<I, Promise<unknown>>>>, O1>,
    onElse?: undefined | Io<NoInfer<Exclude<I, Promise<unknown>>>, O2>,
): O1 | O2 | Io<I, O1 | O2> {
    if (input === PartialApplication.Placeholder) {
        return (input: I) => matchPromise(input, onMatch, onElse)
    }

    if (isPromise(input)) {
        return onMatch(input as IfAnyOrUnknown<I, Promise<unknown>, Extract<I, Promise<unknown>>>)
    }
    if (onElse) {
        return onElse(input as Exclude<I, Promise<unknown>>)
    }
    return input as unknown as O2
}

export function awaitPromise<I, O1, O2>(
    input: PartialApplication.Placeholder,
    onThen: Io<I, O1 | Promise<O1>>,
    onCatch: Io<unknown, O2 | Promise<O2>>,
    onFinally?: undefined | Task,
): Io<Promise<I>, Promise<O1 | O2>>
export function awaitPromise<I, O1, O2>(
    input: Promise<I>,
    onThen: Io<NoInfer<I>, O1 | Promise<O1>>,
    onCatch: Io<unknown, O2 | Promise<O2>>,
    onFinally?: undefined | Task,
): Promise<O1 | O2>
export function awaitPromise<I, O1, O2>(
    input: Promise<I> | PartialApplication.Placeholder,
    onThen: Io<NoInfer<I>, O1 | Promise<O1>>,
    onCatch: Io<unknown, O2 | Promise<O2>>,
    onFinally?: undefined | Task,
): Promise<O1 | O2> | Io<Promise<I>, Promise<O1 | O2>> {
    if (input === PartialApplication.Placeholder) {
        return (input: Promise<I>) => awaitPromise(input, onThen, onCatch, onFinally)
    }

    return input.then(onThen, onCatch).finally(onFinally)
}

export function thenPromise<I, O>(
    input: PartialApplication.Placeholder,
    onThen: Io<I, O | Promise<O>>,
): Io<Promise<I>, Promise<O>>
export function thenPromise<I, O>(
    input: Promise<I>,
    onThen: Io<NoInfer<I>, O | Promise<O>>,
): Promise<O>
export function thenPromise<I, O>(
    input: Promise<I> | PartialApplication.Placeholder,
    onThen: Io<NoInfer<I>, O | Promise<O>>,
): Promise<O> | Io<Promise<I>, Promise<O>> {
    if (input === PartialApplication.Placeholder) {
        return (input: Promise<I>) => thenPromise(input, onThen)
    }

    return input.then(onThen)
}

export function catchPromise<I, O>(
    input: PartialApplication.Placeholder,
    onCatch: Io<unknown, O | Promise<O>>,
): Io<Promise<I>, Promise<I | O>>
export function catchPromise<I, O>(
    input: Promise<I>,
    onCatch: Io<unknown, O | Promise<O>>,
): Promise<I | O>
export function catchPromise<I, O>(
    input: Promise<I> | PartialApplication.Placeholder,
    onCatch: Io<unknown, O | Promise<O>>,
): Promise<I | O> | Io<Promise<I>, Promise<I | O>> {
    if (input === PartialApplication.Placeholder) {
        return (input: Promise<I>) => catchPromise(input, onCatch)
    }

    return input.catch(onCatch)
}

export function _awaitPromise<I, O1, O2>(
    onThen: Io<I, O1 | Promise<O1>>,
    onCatch: Io<unknown, O2 | Promise<O2>>,
    onFinally?: undefined | Task,
): Io<Promise<I>, Promise<O1 | O2>> {
    return (input: Promise<I>) => awaitPromise(input, onThen, onCatch, onFinally)
}

export function _thenPromise<I, O>(
    onThen: Io<I, O | Promise<O>>,
): Io<Promise<I>, Promise<O>> {
    return (input: Promise<I>) => thenPromise(input, onThen)
}

export function _catchPromise<I, O>(
    onCatch: Io<unknown, O | Promise<O>>,
): Io<Promise<I>, Promise<I | O>> {
    return (input: Promise<I>) => catchPromise(input, onCatch)
}

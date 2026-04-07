import type {Task, Io} from './fn-type.js'

export function tryCatch<R, F>(
    onTry: Task<R>,
    onError: Io<unknown, F>,
    onFinally?: undefined | Task,
): R | F {
    try {
        return onTry()
    }
    catch (error) {
        return onError(error)
    }
    finally {
        onFinally?.()
    }
}

export function _tryCatch<I, O1, O2>(
    onTry: Io<I, O1>,
    onCatch: Io<unknown, O2>,
    onFinally?: undefined | Task,
): Io<I, O1 | O2> {
    return (input: I) => tryCatch(() => onTry(input), onCatch, onFinally)
}

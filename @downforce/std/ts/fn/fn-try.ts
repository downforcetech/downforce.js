import type {Task, Io} from './fn-type.js'

export function tryCatch<R, F>(
    block: Task<R>,
    onError: Io<unknown, F>,
    onFinally?: undefined | Task,
): R | F {
    try {
        return block()
    }
    catch (error) {
        return onError(error)
    }
    finally {
        onFinally?.()
    }
}

export function tryCatching<I, O1, O2>(
    block: Io<I, O1>,
    onCatch: Io<unknown, O2>,
    onFinally?: undefined | Task,
): Io<I, O1 | O2> {
    return (input: I) => tryCatch(() => block(input), onCatch, onFinally)
}

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

import type {Io, Task} from '../fn.js'

export function tryCatch<R, F>(block: Task<R>, onError: Io<unknown, F>, onEnd?: undefined | Task): R | F {
    try {
        return block()
    }
    catch (error) {
        return onError(error)
    }
    finally {
        onEnd?.()
    }
}

export function tryCatchEffect<R, F>(
    block: Task<R>,
    onError: Io<unknown, F>,
    onErrorEffect?: undefined | Io<unknown, void>,
): R | F {
    return tryCatch(block, error => {
        onErrorEffect?.(error)
        return onError(error)
    })
}

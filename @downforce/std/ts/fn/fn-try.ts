import type {Fn, FnArgs, Io, Task} from './fn-type.js'

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

/**
* A facade api for the new and not yed widely supported Promise.try().
*/
export function tryCatchAsync<A extends FnArgs, R>(onTry: Fn<A, R | Promise<R>>, ...args: A): Promise<R> {
    const promise = new Promise<R>((resolve) => {
        resolve(onTry(...args))
    })

    return promise
}

// We can't use NoInfer<I> on Partial Application functions definitions
// because it prevents inference when multiple partial application functions
// are combined.
// EXAMPLE
//   pipe(
//     input,
//     _tryCatch(_matchResult(it => it)), // 'it' would be 'never' with 'NoInfer<I>'.
//   )

export function _tryCatch<I, O1, O2>(
    onTry: Io<I, O1>,
    onCatch: Io<unknown, O2>,
    onFinally?: undefined | Task,
): Io<I, O1 | O2> {
    return (input: I) => tryCatch(() => onTry(input), onCatch, onFinally)
}

export function _tryCatchAsync<I, O1>(
    onTry: Io<I, O1 | Promise<O1>>,
): Io<I, Promise<O1>> {
    return (input: I) => tryCatchAsync(() => onTry(input))
}

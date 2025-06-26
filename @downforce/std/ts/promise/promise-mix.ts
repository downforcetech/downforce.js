export function splitPromise<R, E = unknown>(promise: Promise<R>): Promise<[R, undefined] | [undefined, E]> {
    return promise.then(
        result => [result, undefined],
        error => [undefined, error],
    )
}

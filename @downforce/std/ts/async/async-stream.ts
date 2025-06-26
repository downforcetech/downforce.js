import {isArray} from '../array/array-is.js'

/**
* EXAMPLE
*
* ```
* for await (
*     const [
*         books,
*         movies,
*     ] of streamPromises([
*         fetchBooks(),
*         fetchMovies(),
*     ], console.error)
* ) {
* }
*
* for await (
*     const {
*         books,
*         movies,
*     } of streamPromises({
*         books: fetchBooks(),
*         movies: fetchMovies(),
*     }, console.error)
* ) {
* }
* ```
*/
export function streamPromises<T extends Array<Promise<unknown>>>(
    promises: [...T],
    onError?: undefined | ((error: unknown, idx: number) => void),
): AsyncGenerator<AwaitedStreamListOf<[...T]>, AwaitedStreamListOf<[...T]>, void>
export function streamPromises<T extends Record<string, Promise<unknown>>>(
    promises: T,
    onError?: undefined | ((error: unknown, key: string) => void),
): AsyncGenerator<AwaitedStreamDictOf<T>, AwaitedStreamDictOf<T>, void>
export function streamPromises<T extends Array<Promise<unknown>> | Record<string, Promise<unknown>>>(
    promises: T,
    onError?: undefined | ((error: unknown, idxOrKey: number | string | any) => void),
): AsyncGenerator<AwaitedStreamOf<T>, AwaitedStreamOf<T>, void> {
    if (isArray(promises)) {
        return streamPromisesList(promises, onError) as AsyncGenerator<AwaitedStreamOf<T>, AwaitedStreamOf<T>, void>
    }
    return streamPromisesDict(promises, onError) as AsyncGenerator<AwaitedStreamOf<T>, AwaitedStreamOf<T>, void>
}

export async function* streamPromisesDict<T extends Record<string, Promise<unknown>>>(
    promises: T,
    onError?: undefined | ((error: unknown, key: string) => void),
): AsyncGenerator<AwaitedStreamDictOf<T>, AwaitedStreamDictOf<T>, void> {
    const results: Record<string, unknown> = {}
    const queue: Set<Promise<unknown>> = new Set(Object.values(promises))

    for (const [key, promise] of Object.entries(promises)) {
        results[key] = undefined

        promise.then(
            result => {
                results[key] = result
            },
            error => {
                onError?.(error, key)
            },
        ).finally(() => {
            queue.delete(promise)
        })
    }

    while (queue.size > 0) {
        await Promise.race(queue)

        yield {...results} as AwaitedStreamDictOf<T>
    }

    return results as AwaitedStreamDictOf<T>
}

export async function* streamPromisesList<T extends Array<Promise<unknown>>>(
    promises: [...T],
    onError?: undefined | ((error: unknown, idx: number) => void),
): AsyncGenerator<AwaitedStreamListOf<[...T]>, AwaitedStreamListOf<[...T]>, void> {
    const results: Array<unknown> = []
    const queue: Set<Promise<unknown>> = new Set(promises)

    promises.forEach((promise, idx) => {
        results[idx] = undefined

        promise.then(
            result => {
                results[idx] = result
            },
            error => {
                onError?.(error, idx)
            },
        ).finally(() => {
            queue.delete(promise)
        })
    })

    while (queue.size > 0) {
        await Promise.race(queue)

        yield [...results] as AwaitedStreamListOf<[...T]>
    }

    return results as AwaitedStreamListOf<[...T]>
}

// Types ///////////////////////////////////////////////////////////////////////

export type AwaitedStreamOf<T extends Record<string, Promise<unknown>> | Array<Promise<unknown>>> =
    T extends Array<Promise<unknown>>
        ? AwaitedStreamListOf<T>
    : T extends Record<string, Promise<unknown>>
        ? AwaitedStreamDictOf<T>
    : never
export type AwaitedStreamDictOf<T extends Record<string, Promise<unknown>>> = {[key in keyof T]: undefined | Awaited<T[key]>}
export type AwaitedStreamListOf<T extends Array<Promise<unknown>>> = {[key in keyof T]: undefined | Awaited<T[key]>} & {length: T['length']}

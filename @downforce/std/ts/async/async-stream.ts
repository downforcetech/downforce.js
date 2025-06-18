import {isArray} from '@downforce/std/array'

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
): AsyncGenerator<AwaitedListOf<[...T]>, AwaitedListOf<[...T]>, void>
export function streamPromises<T extends Record<string, Promise<unknown>>>(
    promises: T,
    onError?: undefined | ((error: unknown, key: string) => void),
): AsyncGenerator<AwaitedDictOf<T>, AwaitedDictOf<T>, void>
export function streamPromises<T extends Array<Promise<unknown>> | Record<string, Promise<unknown>>>(
    promises: T,
    onError?: undefined | ((error: unknown, idxOrKey: number | string | any) => void),
): AsyncGenerator<AwaitedOf<T>, AwaitedOf<T>, void> {
    if (isArray(promises)) {
        return streamPromisesList(promises, onError) as AsyncGenerator<AwaitedOf<T>, AwaitedOf<T>, void>
    }
    return streamPromisesDict(promises, onError) as AsyncGenerator<AwaitedOf<T>, AwaitedOf<T>, void>
}

export async function* streamPromisesDict<T extends Record<string, Promise<unknown>>>(
    promises: T,
    onError?: undefined | ((error: unknown, key: string) => void),
): AsyncGenerator<AwaitedDictOf<T>, AwaitedDictOf<T>, void> {
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

        yield {...results} as AwaitedDictOf<T>
    }

    return results as AwaitedDictOf<T>
}

export async function* streamPromisesList<T extends Array<Promise<unknown>>>(
    promises: [...T],
    onError?: undefined | ((error: unknown, idx: number) => void),
): AsyncGenerator<AwaitedListOf<[...T]>, AwaitedListOf<[...T]>, void> {
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

        yield [...results] as AwaitedListOf<[...T]>
    }

    return results as AwaitedListOf<[...T]>
}

// Types ///////////////////////////////////////////////////////////////////////

export type AwaitedOf<T extends Record<string, Promise<unknown>> | Array<Promise<unknown>>> =
    T extends Array<Promise<unknown>>
        ? AwaitedListOf<T>
    : T extends Record<string, Promise<unknown>>
        ? AwaitedDictOf<T>
    : never
export type AwaitedDictOf<T extends Record<string, Promise<unknown>>> = {[key in keyof T]: undefined | Awaited<T[key]>}
export type AwaitedListOf<T extends Array<Promise<unknown>>> = {[key in keyof T]: undefined | Awaited<T[key]>} & {length: T['length']}

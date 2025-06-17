import {isArray} from '@downforce/std/array'

export function streamPromises<T extends Array<Promise<unknown>>>(promises: [...T]): AsyncGenerator<StreamedPromisesList<[...T]>, StreamedPromisesList<[...T]>, void>
export function streamPromises<T extends Record<string, Promise<unknown>>>(promises: T): AsyncGenerator<StreamedPromisesDict<T>, StreamedPromisesDict<T>, void>
export function streamPromises<T extends Array<Promise<unknown>> | Record<string, Promise<unknown>>>(promises: T): AsyncGenerator<StreamedPromises<T>, StreamedPromises<T>, void> {
    if (isArray(promises)) {
        return streamPromisesList(promises) as AsyncGenerator<StreamedPromises<T>, StreamedPromises<T>, void>
    }
    return streamPromisesDict(promises) as AsyncGenerator<StreamedPromises<T>, StreamedPromises<T>, void>
}

export async function* streamPromisesDict<T extends Record<string, Promise<unknown>>>(promises: T): AsyncGenerator<StreamedPromisesDict<T>, StreamedPromisesDict<T>, void> {
    const state: Record<string, unknown> = {}
    const queue: Array<Promise<unknown>> = Object.values(promises)

    for (const entry of Object.entries(promises)) {
        const [key, promise] = entry

        promise.then(
            result => {
                state[key] = result
            },
            error => {
                state[key] = undefined
            }
        ).finally(() => {
            queue.splice(queue.indexOf(promise), 1)
        })
    }

    while (queue.length > 0) {
        await Promise.race(queue)

        yield state as StreamedPromisesDict<T>
    }

    return state as StreamedPromisesDict<T>
}

export async function* streamPromisesList<T extends Array<Promise<unknown>>>(promises: [...T]): AsyncGenerator<StreamedPromisesList<[...T]>, StreamedPromisesList<[...T]>, void> {
    const state: Array<unknown> = []
    const queue: Array<Promise<unknown>> = promises.slice()

    for (let idx = 0; idx < promises.length; ++idx) {
        const promise = promises[idx]

        promise.then(
            result => {
                state[idx] = result
            },
            error => {
                state[idx] = undefined
            }
        ).finally(() => {
            queue.splice(queue.indexOf(promise), 1)
        })
    }

    while (queue.length > 0) {
        await Promise.race(queue)

        yield state as StreamedPromisesList<[...T]>
    }

    return state as StreamedPromisesList<[...T]>
}

export type StreamedPromises<T extends Record<string, Promise<unknown>> | Array<Promise<unknown>>> =
    T extends Array<Promise<unknown>>
        ? StreamedPromisesList<T>
    : T extends Record<string, Promise<unknown>>
        ? StreamedPromisesDict<T>
    : never
export type StreamedPromisesDict<T extends Record<string, Promise<unknown>>> = {[key in keyof T]?: undefined | Awaited<T[key]>}
export type StreamedPromisesList<T extends Array<Promise<unknown>>> = {[key in keyof T]: undefined | Awaited<T[key]>} & {length: T['length']}

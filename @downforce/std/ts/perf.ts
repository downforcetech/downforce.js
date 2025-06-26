import type {Task, TaskAsync, TaskSync} from './fn/fn-type.js'
import {isPromise} from './promise.js'

export function measure<R = void>(block: Task<Promise<R>>): Promise<[PerfMeasureTime, R]>
export function measure<R = void>(block: Task<R>): [PerfMeasureTime, R]
export function measure<R = void>(block: Task<R> | Task<Promise<R>>): [PerfMeasureTime, R] | Promise<[PerfMeasureTime, R]> {
    const timeStart = performance.now()
    const blockReturn = block()

    if (isPromise(blockReturn)) {
        return blockReturn.then((result): [PerfMeasureTime, R] => {
            const timeEnd = performance.now()

            return [
                {
                    start: timeStart,
                    end: timeEnd,
                    durationMs: timeEnd - timeStart,
                },
                result,
            ]
        })
    }

    const timeEnd = performance.now()

    return [
        {
            start: timeStart,
            end: timeEnd,
            durationMs: timeEnd - timeStart,
        },
        blockReturn,
    ]
}

export async function measureAsync<R = void>(block: TaskAsync<R>): Promise<[PerfMeasureTime, R]> {
    const timeStart = performance.now()
    const result = await block()
    const timeEnd = performance.now()

    return [
        {
            start: timeStart,
            end: timeEnd,
            durationMs: timeEnd - timeStart,
        },
        result,
    ]
}

export function measureSync<R = void>(block: TaskSync<R>): [PerfMeasureTime, R] {
    const timeStart = performance.now()
    const result = block()
    const timeEnd = performance.now()

    return [
        {
            start: timeStart,
            end: timeEnd,
            durationMs: timeEnd - timeStart,
        },
        result,
    ]
}

// Types ///////////////////////////////////////////////////////////////////////

export interface PerfMeasureTime {
    start: number
    end: number
    durationMs: number
}

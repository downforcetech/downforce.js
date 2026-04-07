import type {Task, TaskAsync, TaskSync} from './fn/fn-type.js'
import {isPromise} from './promise.js'

export function startMeasure(): () => PerfMeasureTime {
    const timeStart = performance.now()

    function stopMeasure(): PerfMeasureTime {
        const timeEnd = performance.now()

        return {
            start: timeStart,
            end: timeEnd,
            durationMs: timeEnd - timeStart,
        }
    }

    return stopMeasure
}

export function measure<R = undefined>(block: Task<Promise<R>>): Promise<[PerfMeasureTime, R]>
export function measure<R = undefined>(block: Task<R>): [PerfMeasureTime, R]
export function measure<R = undefined>(block: Task<R> | Task<Promise<R>>): [PerfMeasureTime, R] | Promise<[PerfMeasureTime, R]> {
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

export async function measureAsync<R = undefined>(block: TaskAsync<R>): Promise<[PerfMeasureTime, R]> {
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

export function measureSync<R = undefined>(block: TaskSync<R>): [PerfMeasureTime, R] {
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

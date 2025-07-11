import {isArray} from '../array/array-is.js'
import {throwInvalidArgument} from '../error/error-new.js'
import {isFunction} from '../fn/fn-is.js'
import type {TaskAsync} from '../fn/fn-type.js'
import {isObject} from '../object/object-is.js'

export async function runAsyncTimeline(timeline: AsyncTimelineMixed): Promise<unknown> {
    if (isFunction(timeline)) {
        return timeline()
    }
    if (isArray(timeline)) {
        const results: Array<unknown> = []
        for (const task of timeline) {
            results.push(await runAsyncTimeline(task))
        }
        return results
    }
    if (isObject(timeline)) {
        return Promise.all(
            Object.values(timeline).map(runAsyncTimeline),
        )
    }

    return throwInvalidArgument(
        'runAsyncTimeline(~~timeline~~):\n'
        + `timeline must be a Function | Array | Object, given "${timeline}".`
    )
}

// Types ///////////////////////////////////////////////////////////////////////

export type AsyncTimelineMixed<R = unknown> =
    | AsyncTimelineTask<R>
    | AsyncTimelineSerial<R>
    | AsyncTimelineParallel<R>

export type AsyncTimelineTask<R = unknown> = TaskAsync<R>

export type AsyncTimelineSerial<R = unknown> = Array<AsyncTimelineMixed<R>>
export type AsyncTimelineParallel<R = unknown> = {[key: PropertyKey]: AsyncTimelineMixed<R>}

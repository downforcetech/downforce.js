import {compute} from './fn/fn-compute.js'
import {throwInvalidCondition} from './error.js'

/**
* @throws Error
*/
export function assert(condition: boolean, error: string | (() => string)): void {
    if (! condition) {
        throwInvalidCondition(compute(error))
    }
}

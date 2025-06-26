import {throwInvalidCondition} from './error/error-new.js'
import {compute} from './fn/fn-compute.js'

/**
* @throws Error
*/
export function assert(condition: boolean, error: string | (() => string)): void {
    if (! condition) {
        throwInvalidCondition(compute(error))
    }
}

import type {FnArgs} from './fn-type.js'

/*
* EXAMPLE
* list.filter(not(isNaN))
*/
export function not<A extends FnArgs>(
    fn: (...args: A) => boolean,
): (...args: A) => boolean {
    function notFn(...args: A) {
        return ! fn(...args)
    }

    return notFn
}

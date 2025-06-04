import type {Io} from '../fn.js'
import {tryCatch} from './fn-try.js'

export function tryCatchTo<I, O1, O2>(onTry: Io<I, O1>, onCatch: Io<unknown, O2>): Io<I, O1 | O2> {
    return (input: I) => tryCatch(() => onTry(input), onCatch)
}

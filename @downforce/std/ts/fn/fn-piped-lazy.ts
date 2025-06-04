import {identity} from './fn-return.js'
import type {Io} from './fn-type.js'

export function pipedLazy(): PipeLazy<undefined>
export function pipedLazy<V1>(input: V1): PipeLazy<V1>
export function pipedLazy<V1>(input?: V1): PipeLazy<undefined | V1> {
    const stack: Array<PipeLazyTask> = [identity]

    function compute(stack: Array<PipeLazyTask>): unknown {
        return computePipeLazy(stack, input)
    }

    return createPipeLazy(stack, compute) as PipeLazy<V1>
}

export function createPipeLazy(
    stack: Array<PipeLazyTask>,
    compute: Io<Array<PipeLazyTask>, unknown>,
): PipeLazy<any> {
    const self: PipeLazy<any> = {
        get __stack__() {
            return stack
        },
        to(fn) {
            return createPipeLazy([...stack, fn], compute)
        },
        get end() {
            return compute(stack)
        },
    }

    return self
}

export function computePipeLazy(stack: Array<PipeLazyTask>, input: unknown): unknown {
    const [task, ...otherStack] = stack

    if (! task) {
        return input
    }

    return computePipeLazy(otherStack, task(input))
}

// Types ///////////////////////////////////////////////////////////////////////

export interface PipeLazy<V1> {
    __stack__: Array<PipeLazyTask>
    to<V2>(fn: Io<V1, V2>): PipeLazy<V2>
    end: V1
}

export type PipeLazyTask = Io<unknown, unknown>

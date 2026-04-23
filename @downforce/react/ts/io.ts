import type {FnArgs, FnAsync, Io, Task} from '@downforce/std/fn'
import {areObjectsEqualShallow} from '@downforce/std/object'
import {isDefined} from '@downforce/std/optional'
import {catchPromiseError, isError, isResult, matchOutcome, type OutcomeResultOrError} from '@downforce/std/outcome'
import type {PromiseView} from '@downforce/std/promise'
import type {FIX} from '@downforce/std/type'
import {startTransition, useCallback, useEffect, useRef, useState} from 'react'
import {NoDeps, type HookDeps} from './hook.js'

export function useAsyncIo<A extends FnArgs, R>(
    onCallCallback: FnAsync<A, R>,
    deps?: undefined | HookDeps,
): AsyncIoManager<A, R> {
    const onCallMemoized = useCallback(onCallCallback, deps ?? NoDeps)
    const [state, setState] = useState<AsyncIoState<R>>({
        output: undefined,
        error: undefined,
        result: undefined,
        fulfilled: false,
        rejected: false,
        pending: false,
        settled: true,
    })
    const taskHandleRef = useRef<TaskHandle>(undefined)

    interface TaskHandle {
        canceled: boolean
        readonly promise: Promise<OutcomeResultOrError<R, unknown>>
    }

    const call = useCallback(async (...args: A): Promise<undefined | OutcomeResultOrError<R, unknown>> => {
        // We must cancel previous task.
        if (taskHandleRef.current) {
            taskHandleRef.current.canceled = true
        }

        // We must retain current result and error states.
        // Whether the developer wants to clear them, he uses the reset() API
        // before issuing a call() request.
        setState(state => {
            const nextState: AsyncIoState<R> = {
                output: state.output,
                error: state.error,
                result: state.result,
                fulfilled: state.fulfilled,
                rejected: state.rejected,
                pending: true,
                settled: false,
            }
            if (areObjectsEqualShallow(state, nextState)) {
                return state // Optimization.
            }
            return nextState
        })

        const taskHandle: TaskHandle = {
            canceled: false,
            promise: catchPromiseError(Promise.try(() => onCallMemoized(...args))),
        }

        taskHandleRef.current = taskHandle

        const resultOrError: OutcomeResultOrError<R, unknown> = await taskHandle.promise

        if (taskHandle.canceled) {
            return
        }

        startTransition(() => {
            setState(
                matchOutcome(resultOrError,
                    (result): AsyncIoState<R> => ({
                        output: resultOrError,
                        error: undefined,
                        result: result,
                        fulfilled: true,
                        rejected: false,
                        pending: false,
                        settled: true,
                    }),
                    (error): AsyncIoState<R> => ({
                        output: resultOrError,
                        error: error,
                        result: undefined,
                        fulfilled: false,
                        rejected: true,
                        pending: false,
                        settled: true,
                    }),
                )
            )
        })

        return resultOrError
    }, [onCallMemoized])

    const cancel = useCallback((): undefined => {
        if (taskHandleRef.current) {
            taskHandleRef.current.canceled = true
        }

        setState(state => {
            const nextState: AsyncIoState<R> = {
                output: state.output,
                error: state.error,
                result: state.result,
                fulfilled: state.fulfilled,
                rejected: state.rejected,
                pending: false,
                settled: true,
            }
            if (areObjectsEqualShallow(state, nextState)) {
                return state // Optimization.
            }
            return nextState
        })
    }, [])

    const reset = useCallback((): undefined => {
        setState(state => {
            const nextState: AsyncIoState<R> = {
                output: undefined,
                error: undefined,
                result: undefined,
                fulfilled: false,
                rejected: false,
                pending: false,
                settled: true,
            }
            if (areObjectsEqualShallow(state, nextState)) {
                return state // Optimization.
            }
            return nextState
        })
    }, [])

    const resetError = useCallback((): undefined => {
        setState(state => {
            const nextState: AsyncIoState<R> = {
                output: isError(state.output) ? undefined : state.output,
                error: undefined,
                result: state.result,
                fulfilled: state.fulfilled,
                rejected: false,
                pending: state.pending,
                settled: state.settled,
            }
            if (areObjectsEqualShallow(state, nextState)) {
                return state // Optimization.
            }
            return nextState
        })
    }, [])

    const resetResult = useCallback((): undefined => {
        setState(state => {
            const nextState: AsyncIoState<R> = {
                output: isResult(state.output) ? undefined : state.output,
                error: state.error,
                result: undefined,
                fulfilled: false,
                rejected: state.rejected,
                pending: state.pending,
                settled: state.settled,
            }
            if (areObjectsEqualShallow(state, nextState)) {
                return state // Optimization.
            }
            return nextState
        })
    }, [])

    return {...state, call, cancel, reset, resetError, resetResult}
}

export function useAsyncIoEffect<I extends AsyncIoState<any>>(
    io: I,
    onEffectCallback: Io<I, undefined | Task>,
    deps?: undefined | HookDeps,
  ): undefined {
    const onEffectMemoized = useCallback(onEffectCallback, deps ?? NoDeps)

    useEffect(() => {
        return onEffectMemoized(io) as FIX<void | (() => void)>
    }, [
        onEffectMemoized,
        io.pending,
        io.settled,
        io.fulfilled,
        io.rejected,
        io.output,
        io.result,
        io.error,
    ])
}

export function useAsyncIoAggregated(asyncIoDict: Record<string, AsyncIoState<unknown>>): {
    errors: Array<unknown>
    results: Array<unknown>
    pending: boolean
    rejected: boolean
    settled: boolean
    hasError: boolean
} {
    const values = Object.values(asyncIoDict)
    const errors = values.map(it => it.error).filter(isDefined)
    const results = values.map(it => it.result)
    const pending = values.some(it => it.pending)
    const rejected = values.some(it => it.rejected)
    const settled = values.every(it => it.settled)
    const hasError = errors.length > 0

    return {errors, results, pending, settled, rejected, hasError}
}

export function pickAsyncIoState<S>(io: AsyncIoState<S>): AsyncIoState<S> {
    return {
        // PromiseView.
        pending: io.pending,
        settled: io.settled,
        fulfilled: io.fulfilled,
        rejected: io.rejected,
        // Outcome.
        output: io.output,
        result: io.result,
        error: io.error,
    }
}

// Types ///////////////////////////////////////////////////////////////////////

export interface AsyncIoState<R> extends PromiseView {
    output: undefined | OutcomeResultOrError<R, unknown>
    error: undefined | unknown
    result: undefined | R
}

export interface AsyncIoManager<A extends FnArgs, R> extends AsyncIoState<R> {
    call(...args: A): Promise<undefined | OutcomeResultOrError<R, unknown>>
    cancel(): undefined
    reset(): undefined
    resetError(): undefined
    resetResult(): undefined
}

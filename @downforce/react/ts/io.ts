import type {Fn, FnArgs, FnAsync, Task} from '@downforce/std/fn'
import {areObjectsEqualShallow} from '@downforce/std/object'
import {isDefined} from '@downforce/std/optional'
import {isError, isResult, mapResultOrError, ResultOrError, type OutcomeResultOrError} from '@downforce/std/outcome'
import type {PromiseView} from '@downforce/std/promise'
import {startTransition, useCallback, useEffect, useRef, useState} from 'react'

export function useAsyncIo<A extends FnArgs, R>(asyncTask: FnAsync<A, R>, deps?: Array<unknown>): AsyncIoManager<A, R> {
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
        cancel(): void
        canceled: boolean
        readonly promise: Promise<OutcomeResultOrError<R, unknown>>
    }

    const call = useCallback(async (...args: A): Promise<undefined | OutcomeResultOrError<R, unknown>> => {
        // We must cancel previous task.
        taskHandleRef.current?.cancel()

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
            cancel() { taskHandle.canceled = true },
            canceled: false,
            promise: ResultOrError(asyncTask(...args)),
        }

        taskHandleRef.current = taskHandle

        const resultOrError: OutcomeResultOrError<R, unknown> = await taskHandle.promise

        if (taskHandle.canceled && taskHandleRef.current === taskHandle) {
            // Task has been canceled with cancel() and no new task started with call().
            return
        }
        if (taskHandle.canceled && taskHandleRef.current !== taskHandle) {
            // Task has been canceled with cancel() and a new task started after current one.
            // We fulfill current one with the result-or-error of the newer one.
            return taskHandleRef.current?.promise
        }

        startTransition(() => {
            setState(
                mapResultOrError(resultOrError,
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
    }, deps ?? [])

    const cancel = useCallback(() => {
        taskHandleRef.current?.cancel()

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

    const reset = useCallback(() => {
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

    const resetError = useCallback(() => {
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

    const resetResult = useCallback(() => {
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

export function useAsyncIoEffect<R>(
    ioContext: AsyncIoState<R>,
    effect: Fn<[AsyncIoState<R>], void | Task>,
    deps?: undefined | Array<any>,
  ): void {
    useEffect(
      () => effect(ioContext),
      [
        ioContext.pending,
        ioContext.settled,
        ioContext.fulfilled,
        ioContext.rejected,
        ioContext.output,
        ioContext.result,
        ioContext.error,
        ...deps ?? [],
      ],
    )
  }

export function useAsyncIoAggregated(asyncIoStates: Record<string, AsyncIoState<unknown>>): {
    errors: Array<unknown>
    results: Array<unknown>
    pending: boolean
    rejected: boolean
    settled: boolean
    hasError: boolean
} {
    const values = Object.values(asyncIoStates)
    const errors = values.map(it => it.error).filter(isDefined)
    const results = values.map(it => it.result)
    const pending = values.some(it => it.pending)
    const rejected = values.some(it => it.rejected)
    const settled = values.every(it => it.settled)
    const hasError = errors.length > 0

    return {errors, results, pending, settled, rejected, hasError}
}

// Types ///////////////////////////////////////////////////////////////////////

export interface AsyncIoState<R> extends PromiseView {
    output: undefined | OutcomeResultOrError<R, unknown>
    error: undefined | unknown
    result: undefined | R
}

export interface AsyncIoManager<A extends FnArgs, R> extends AsyncIoState<R> {
    call(...args: A): Promise<undefined | OutcomeResultOrError<R, unknown>>
    cancel(): void
    reset(): void
    resetError(): void
    resetResult(): void
}

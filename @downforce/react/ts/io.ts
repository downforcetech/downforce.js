import type {FnArgs, FnAsync, Io, Task} from '@downforce/std/fn'
import {areObjectsEqualShallow} from '@downforce/std/object'
import {isDefined} from '@downforce/std/optional'
import {createError, matchOutcome, type OutcomeResultOrError} from '@downforce/std/outcome'
import type {PromiseView} from '@downforce/std/promise'
import type {FIX, ValueOf} from '@downforce/std/type'
import {startTransition, useCallback, useEffect, useRef, useState} from 'react'
import {useCallback2, type HookDeps} from './memo.js'

export function useAsyncIo<A extends FnArgs, R>(
    onCall: FnAsync<A, R>,
    deps?: undefined | HookDeps,
): UseAsyncIoContract<A, R> {
    const onCallMemoized = useCallback2(onCall, deps)

    interface TaskHandle {
        canceled: boolean
        readonly promise: Promise<OutcomeResultOrError<R, unknown>>
    }

    const [state, setState] = useState<AsyncIoState<R>>({
        pending: false,
        settled: true,
        fulfilled: false,
        rejected: false,
        result: undefined,
        error: undefined,
    })
    const taskHandleRef = useRef<TaskHandle>(undefined)

    const call = useCallback(async (...args: A): Promise<AsyncIoCallOutcome<R>> => {
        // We must cancel previous task.
        if (taskHandleRef.current) {
            taskHandleRef.current.canceled = true
        }

        // We must retain current result and error states.
        // If those states must be reset, the reset() API can be used before a call() request.
        setState((state): typeof state => {
            const nextState: AsyncIoState<R> = {
                pending: true,
                settled: false,
                fulfilled: state.fulfilled,
                rejected: state.rejected,
                result: state.result,
                error: state.error,
            }
            if (areObjectsEqualShallow(state, nextState)) {
                return state // Optimization.
            }
            return nextState
        })

        const taskHandle: TaskHandle = {
            canceled: false,
            promise: Promise.try(() => onCallMemoized(...args)).catch(createError),
        }

        taskHandleRef.current = taskHandle

        const outcome: OutcomeResultOrError<R, unknown> = await taskHandle.promise

        if (taskHandle.canceled) {
            return {
                fulfilled: false,
                rejected: false,
                canceled: true,
                result: undefined,
                error: undefined,
            }
        }

        matchOutcome(outcome,
            result => {
                startTransition(() => {
                    setState({
                        pending: false,
                        settled: true,
                        fulfilled: true,
                        rejected: false,
                        result: result,
                        error: undefined,
                    })
                })
            },
            error => {
                startTransition(() => {
                    setState({
                        pending: false,
                        settled: true,
                        fulfilled: false,
                        rejected: true,
                        result: undefined,
                        error: error,
                    })
                })
            },
        )

        return matchOutcome(outcome,
            (result): AsyncIoCallOutcome<R> => ({
                fulfilled: true,
                rejected: false,
                canceled: false,
                result: result,
                error: undefined,
            }),
            (error): AsyncIoCallOutcome<R> => ({
                fulfilled: false,
                rejected: true,
                canceled: false,
                result: undefined,
                error: error,
            }),
        )
    }, [onCallMemoized])

    const cancel = useCallback((): undefined => {
        if (taskHandleRef.current) {
            taskHandleRef.current.canceled = true
        }

        setState((state): typeof state => {
            const nextState: AsyncIoState<R> = {
                pending: false,
                settled: true,
                fulfilled: state.fulfilled,
                rejected: state.rejected,
                result: state.result,
                error: state.error,
            }
            if (areObjectsEqualShallow(state, nextState)) {
                return state // Optimization.
            }
            return nextState
        })
    }, [])

    const reset = useCallback((): undefined => {
        setState((state): typeof state => {
            const nextState: AsyncIoState<R> = {
                pending: false,
                settled: true,
                fulfilled: false,
                rejected: false,
                result: undefined,
                error: undefined,
            }
            if (areObjectsEqualShallow(state, nextState)) {
                return state // Optimization.
            }
            return nextState
        })
    }, [])

    const resetError = useCallback((): undefined => {
        setState((state): typeof state => {
            const nextState: AsyncIoState<R> = {
                pending: state.pending,
                settled: state.settled,
                fulfilled: state.fulfilled,
                rejected: false,
                result: state.result,
                error: undefined,
            }
            if (areObjectsEqualShallow(state, nextState)) {
                return state // Optimization.
            }
            return nextState
        })
    }, [])

    const resetResult = useCallback((): undefined => {
        setState((state): typeof state => {
            const nextState: AsyncIoState<R> = {
                pending: state.pending,
                settled: state.settled,
                fulfilled: false,
                rejected: state.rejected,
                result: undefined,
                error: state.error,
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
    onEffect: Io<I, undefined | Task>,
    deps?: undefined | HookDeps,
  ): undefined {
    const onEffectMemoized = useCallback2(onEffect, deps)

    useEffect(() => {
        return onEffectMemoized(io) as FIX<void | (() => void)>
    }, [
        onEffectMemoized,
        io.pending,
        io.settled,
        io.fulfilled,
        io.rejected,
        io.result,
        io.error,
    ])
}

export function useAsyncIoAggregated(asyncIoDict: Record<string, AsyncIoState<unknown>>): {
    pending: boolean
    settled: boolean
    fulfilled: boolean
    rejected: boolean
    results: Array<unknown>
    errors: Array<unknown>
    hasError: boolean
} {
    const values = Object.values(asyncIoDict)
    const errors = values.map(it => it.error).filter(isDefined)

    return {
        pending: values.some(it => it.pending),
        settled: values.every(it => it.settled),
        fulfilled: values.every(it => it.fulfilled),
        rejected: values.some(it => it.rejected),
        results: values.map(it => it.result),
        errors,
        hasError: errors.length > 0,
    }
}

export function pickAsyncIoState<S>(io: AsyncIoState<S>): AsyncIoState<S> {
    return {
        // PromiseView.
        pending: io.pending,
        settled: io.settled,
        fulfilled: io.fulfilled,
        rejected: io.rejected,
        // Outcome.
        result: io.result,
        error: io.error,
    }
}

// Types ///////////////////////////////////////////////////////////////////////

export interface AsyncIoState<R> extends PromiseView {
    result: undefined | R
    error: undefined | unknown
}

export interface UseAsyncIoContract<A extends FnArgs, R> extends AsyncIoState<R> {
    call(...args: A): Promise<AsyncIoCallOutcome<R>>
    cancel(): undefined
    reset(): undefined
    resetError(): undefined
    resetResult(): undefined
}

export type AsyncIoCallOutcome<R> = ValueOf<AsyncIoCallOutcomeByTypes<R>>

export interface AsyncIoCallOutcomeByTypes<R> {
    Fulfilled: {
        fulfilled: true
        rejected: false
        canceled: false
        result: R
        error: undefined
    }
    Rejected: {
        fulfilled: false
        rejected: true
        canceled: false
        result: undefined
        error: unknown
    }
    Canceled: {
        fulfilled: false
        rejected: false
        canceled: true
        result: undefined
        error: undefined
    }
}

import {type EventTask, type ThrottledOptions, debounced, throttled} from '@downforce/std/event'
import type {Fn, FnArgs, Task} from '@downforce/std/fn'
import {isNumber} from '@downforce/std/number'
import {startTransition, useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {type HookDeps, NoDeps, useCallback2} from './memo.js'
import {type StateInit, type StateWriterArg, type UseState3Contract, useState3} from './state.js'

export function useCallbackDebounced<A extends FnArgs>(
    delay: number,
    onCall: Fn<A>,
    deps?: undefined | HookDeps,
): EventTask<A> {
    const onCallMemoized = useCallback2(onCall, deps)

    const callbackDebounced = useMemo(() => {
        return debounced(onCallMemoized, delay)
    }, [onCallMemoized, delay])

    useEffect(() => {
        function onClean() {
            callbackDebounced.cancel()
        }

        return onClean
    }, [callbackDebounced])

    return callbackDebounced
}

export function useCallbackThrottled<A extends FnArgs>(
    delayOrOptions: number | ({delay: number} & ThrottledOptions),
    onCall: Fn<A>,
    deps?: undefined | HookDeps,
): EventTask<A> {
    const onCallMemoized = useCallback2(onCall, deps)
    const delay = isNumber(delayOrOptions) ? delayOrOptions : delayOrOptions.delay
    const leading = isNumber(delayOrOptions) ? undefined : delayOrOptions.leading
    const trailing = isNumber(delayOrOptions) ? undefined : delayOrOptions.trailing

    const callbackThrottled = useMemo(() => {
        return throttled(onCallMemoized, delay, {
            leading: leading,
            trailing: trailing,
        })
    }, [onCallMemoized, delay, leading, trailing])

    useEffect(() => {
        function onClean() {
            callbackThrottled.cancel()
        }

        return onClean
    }, [callbackThrottled])

    return callbackThrottled
}

export function useCallbackDelayed<A extends FnArgs>(
    delay: number,
    onCall: Fn<A>,
    deps?: undefined | HookDeps,
): {
    (...args: A): undefined
    cancel: Task
} {
    const onCallMemoized = useCallback2(onCall, deps)
    const taskRef = useRef<ReturnType<typeof setTimeout>>(undefined)

    const cancel = useCallback((): undefined => {
        if (! taskRef.current) {
            return
        }

        taskRef.current = void clearTimeout(taskRef.current)
    }, [])

    const onCallDelayed = useCallback((...args: A): undefined => {
        cancel()

        taskRef.current = setTimeout(onCallMemoized, delay, ...args)
    }, [onCallMemoized, cancel])

    useEffect(() => {
        return cancel
    }, [cancel])

    type Return = (typeof onCallDelayed) & {cancel: Task}

    (onCallDelayed as Return).cancel = cancel

    return onCallDelayed as Return
}

export function useStateDebounced<V>(
    initialValue: undefined,
    delay: number,
): UseState3Contract<undefined | V, undefined>
export function useStateDebounced<V>(
    initialValue: StateInit<V>,
    delay: number,
): UseState3Contract<V, undefined>
export function useStateDebounced<V>(
    initialValue: undefined | V,
    delay: number,
): UseState3Contract<undefined | V, undefined> {
    const [state, setState, getState] = useState3(initialValue)

    const setStateDebounced = useCallbackDebounced(
        delay,
        (state: StateWriterArg<undefined | V>): undefined => {
            startTransition(() => {
                setState(state)
            })
        },
        [setState, getState],
    )

    return [state, setStateDebounced, getState]
}

export function useStateThrottled<V>(
    initialValue: undefined,
    delay: number,
): UseState3Contract<undefined | V, undefined>
export function useStateThrottled<V>(
    initialValue: StateInit<V>,
    delay: number,
): UseState3Contract<V, undefined>
export function useStateThrottled<V>(
    initialValue: undefined | V,
    delay: number,
): UseState3Contract<undefined | V, undefined> {
    const [state, setState, getState] = useState3(initialValue)

    const setStateThrottled = useCallbackThrottled(
        delay,
        (state: StateWriterArg<undefined | V>): undefined => {
            startTransition(() => {
                setState(state)
            })
        },
        [setState, getState],
    )

    return [state, setStateThrottled, getState]
}

export function useValueDebounced<V>(input: V, delay: number): V {
    const [output, setOutput] = useState(input)

    const setOutputDebounced = useCallbackDebounced(
        delay,
        (value: V) => {
            startTransition(() => {
                setOutput(value)
            })
        },
        NoDeps,
    )

    useEffect(() => {
        setOutputDebounced(input)
    }, [input])

    return output
}

export function useValueThrottled<V>(input: V, delay: number): V {
    const [output, setOutput] = useState(input)

    const setOutputThrottled = useCallbackThrottled(
        delay,
        (value: V) => {
            startTransition(() => {
                setOutput(value)
            })
        },
        NoDeps,
    )

    useEffect(() => {
        setOutputThrottled(input)
    }, [input])

    return output
}

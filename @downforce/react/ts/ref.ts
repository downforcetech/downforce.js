import {isFunction} from '@downforce/std/fn'
import {isObject} from '@downforce/std/object'
import type {None} from '@downforce/std/optional'
import {useLayoutEffect, useMemo, useRef} from 'react'

export function useMergeRefs<V>(...refs: Array<void | None | RefHandler<None | V>>): (instance: null | V) => undefined {
    const onRef = useMemo(() => {
        return mergingRefs(...refs)
    }, refs)

    return onRef
}

export function mergingRefs<V>(...refs: Array<void | None | RefHandler<None | V>>): (instance: null | V) => undefined {
    function onRef(instance: null | V): undefined {
        for (const ref of refs) {
            if (! ref) {
                continue
            }

            setRef<None | V>(ref, instance)
        }
    }
    return onRef
}

export function setRef<V>(ref: RefHandler<V>, value: V): undefined {
    if (isFunction(ref)) {
        ref(value)
        return
    }
    if (isObject(ref)) {
        ref.current = value
        return
    }
}

export function usePreviousValueRef<T>(value: T): React.RefObject<undefined | T> {
    const oldValueRef = useRef<T>(undefined)

    useLayoutEffect(() => {
        function onClean() {
            oldValueRef.current = value
        }

        return onClean
    }, [value])

    return oldValueRef
}

// Types ///////////////////////////////////////////////////////////////////////

export type RefHandler<V> = React.RefObject<V> | React.RefCallback<V> | React.ForwardedRef<V>

export interface RefProp<V> {
    onRef?: undefined | RefHandler<V>
}

export type RefValueOf<R extends None | React.Ref<any> | React.ForwardedRef<any>> =
    R extends React.RefObject<infer V>
        ? V
    : R extends React.RefCallback<infer V>
        ? V
    : R extends None
        ? never
    : never

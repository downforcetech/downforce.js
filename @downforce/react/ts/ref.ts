import {isFunction} from '@downforce/std/fn'
import {isObject} from '@downforce/std/object'
import type {None} from '@downforce/std/optional'
import type {Void} from '@downforce/std/type'
import {useMemo} from 'react'

export function useMergeRefs<V>(...refs: Array<undefined | RefHandlerMixed<V>>): (instance: V) => undefined {
    const onRef = useMemo(() => {
        return mergeRefs(...refs)
    }, refs)

    return onRef
}

export function mergeRefs<V>(...refs: Array<undefined | RefHandlerMixed<V>>): (instance: V) => undefined {
    function onRef(instance: V): undefined {
        for (const ref of refs) {
            if (! ref) {
                continue
            }

            setRef(ref, instance)
        }
    }

    return onRef
}

export function setRef<V>(ref: RefHandlerMixed<V>, value: V): undefined {
    if (isFunction(ref)) {
        ref(value)
    }
    else if (isObject(ref)) {
        ref.current = value
    }
}

// Types ///////////////////////////////////////////////////////////////////////

export type RefHandlerMixed<V> =
    | ((ref: V) => Void)
    | React.RefObject<V>
    | React.RefCallback<V>
    | React.Ref<V>
    | React.ForwardedRef<V>

export interface RefProp<V> {
    onRef?: undefined | RefHandlerMixed<V>
}

export type RefValueOf<R extends None | React.Ref<any>/* | React.ForwardedRef<any>*/> =
    R extends React.RefObject<infer V>
        ? V
    : R extends React.RefCallback<infer V>
        ? V
    : R extends None
        ? never
    : never

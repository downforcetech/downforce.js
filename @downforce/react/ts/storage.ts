import {trustBoolean} from '@downforce/std/boolean'
import {scheduleMacroTaskUsingTimeout} from '@downforce/std/eventloop'
import {identity, tryCatch, type Io, type Task} from '@downforce/std/fn'
import {trustNumber} from '@downforce/std/number'
import {ReadWrite} from '@downforce/std/store'
import type {BrowserStorageAccessorSync, BrowserStorageValue} from '@downforce/web/storage'
import {useCallback, useMemo, useRef, useState} from 'react'

export function useBrowserStorageAccessor<V = string>(
    accessor: BrowserStorageAccessorSync<V>,
    codecOptional?: undefined,
): BrowserStorageManager<V>
export function useBrowserStorageAccessor<V = string, S = string>(
    accessor: BrowserStorageAccessorSync<S>,
    codec: BrowserStorageManagerOptions<V>,
): BrowserStorageManager<V>
export function useBrowserStorageAccessor<V = string, S = string>(
    accessor: BrowserStorageAccessorSync<S>,
    codecOptional?: undefined | BrowserStorageManagerOptions<V>,
): BrowserStorageManager<S | V> {
    const decode = (codecOptional?.decode ?? identity) as Io<BrowserStorageValue<S>, BrowserStorageValue<S | V>>
    const encode = (codecOptional?.encode ?? identity) as Io<BrowserStorageValue<S | V>, BrowserStorageValue<S>>
    // Reading from LocalStorage is slow, so we must wrap value access.
    const [initialValue, render] = useState(() => decode(accessor.read()))
    const valueRef = useRef(initialValue)
    const cancelWriteTaskRef = useRef<undefined | Task>(undefined)

    const read = useCallback((): BrowserStorageValue<S | V> => {
        return valueRef.current
    }, [])

    const write = useCallback(<I extends BrowserStorageValue<S | V>>(newValue: I): I => {
        valueRef.current = newValue

        render(newValue)

        cancelWriteTaskRef.current?.()
        cancelWriteTaskRef.current = scheduleMacroTaskUsingTimeout(() => {
            // We can't use valueRef.current here, due to React 17/18 constraint
            // on references usage on unmounted components. When the the macro task
            // is executed, the component could be unmounted and the reference
            // would be undefined.
            accessor.write(encode(newValue))
            cancelWriteTaskRef.current = undefined
        })

        return newValue
    }, [])

    const accessorManager = useMemo(() => {
        return ReadWrite(read, write)
    }, [read, write])

    return accessorManager
}

export function useBrowserStorageString(accessor: BrowserStorageAccessorSync<string>): BrowserStorageManager<string> {
    return useBrowserStorageAccessor(accessor, {
        encode: value => value ?? '',
        decode: value => value ?? '',
    })
}

export function useBrowserStorageNumber(accessor: BrowserStorageAccessorSync<string>): BrowserStorageManager<number> {
    return useBrowserStorageAccessor(accessor, {
        encode: value => JSON.stringify(value),
        decode: value => value
            ? trustNumber(
                tryCatch(
                    () => JSON.parse(value) as unknown,
                    console.warn,
                )
            )
            : undefined
        ,
    })
}

export function useBrowserStorageBoolean(accessor: BrowserStorageAccessorSync<string>): BrowserStorageManager<boolean> {
    return useBrowserStorageAccessor(accessor, {
        encode: value => JSON.stringify(value),
        decode: value => value
            ? trustBoolean(
                tryCatch(
                    () => JSON.parse(value) as unknown,
                    console.warn,
                )
            )
            : undefined
        ,
    })
}

// Types ///////////////////////////////////////////////////////////////////////

export interface BrowserStorageManager<V> extends BrowserStorageAccessorSync<V> {
}

export interface BrowserStorageManagerOptions<V, S = string> {
    encode: Io<BrowserStorageValue<V>, BrowserStorageValue<S>>
    decode: Io<BrowserStorageValue<S>, BrowserStorageValue<V>>
}

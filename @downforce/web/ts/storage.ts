import {tryCatch} from '@downforce/std/fn-try'
import type {Io} from '@downforce/std/fn-type'
import {createReadWrite, type RwSync} from '@downforce/std/rw'
import {asBoolean, asNumber} from '@downforce/std/type-as'
import {isUndefined} from '@downforce/std/type-is'

export function createBrowserStorageAccessor(
    key: string,
    options?: undefined | BrowserStorageAccessorOptions,
): BrowserStorageAccessorSync<string> {
    const storage: Storage = options?.storage ?? window.localStorage

    function read(): BrowserStorageValue<string> {
        return storage.getItem(key) ?? undefined
    }

    function write<I extends BrowserStorageValue<string>>(newValue: I): I {
        if (isUndefined(newValue)) {
            storage.removeItem(key)
        }
        else {
            storage.setItem(key, newValue)
        }
        return newValue
    }

    return createReadWrite(read, write)
}

export function createBrowserStorageAccessorJson<V = unknown>(
    key: string,
    options?: undefined | BrowserStorageAccessorOptions,
): BrowserStorageAccessorSync<V> {
    const accessor = createBrowserStorageAccessor(key, options)
    const onReadError = options?.onReadError ?? console.warn

    function read(): BrowserStorageValue<V> {
        const value = accessor.read()

        if (! value) {
            return
        }

        return tryCatch(
            () => JSON.parse(value) as V,
            error => void onReadError(error),
        )
    }

    function write<I extends BrowserStorageValue<V>>(newValue: I): I {
        accessor.write(JSON.stringify(newValue))

        return newValue
    }

    return createReadWrite(read, write)
}

export function createBrowserStorageAccessorString(
    key: string,
    options?: undefined | BrowserStorageAccessorOptions,
): BrowserStorageAccessorSync<string> {
    return createBrowserStorageAccessor(key, options)
}

export function createBrowserStorageAccessorNumber(
    key: string,
    options?: undefined | BrowserStorageAccessorOptions,
): BrowserStorageAccessorSync<number> {
    const accessor = createBrowserStorageAccessor(key, options)
    const onReadError = options?.onReadError ?? console.warn

    function read(): BrowserStorageValue<number> {
        const value = accessor.read()

        if (! value) {
            return
        }

        return asNumber(
            tryCatch(
                () => JSON.parse(value) as unknown,
                error => void onReadError(error),
            ),
        )
    }

    function write<I extends BrowserStorageValue<number>>(newValue: I): I {
        accessor.write(JSON.stringify(newValue))

        return newValue
    }

    return createReadWrite(read, write)
}

export function createBrowserStorageAccessorBoolean(
    key: string,
    options?: undefined | BrowserStorageAccessorOptions,
): BrowserStorageAccessorSync<boolean> {
    const accessor = createBrowserStorageAccessor(key, options)
    const onReadError = options?.onReadError ?? console.warn

    function read(): BrowserStorageValue<boolean> {
        const value = accessor.read()

        if (! value) {
            return
        }

        return asBoolean(
            tryCatch(
                () => JSON.parse(value) as unknown,
                error => void onReadError(error),
            ),
        )
    }

    function write(newValue: BrowserStorageValue<boolean>): BrowserStorageValue<boolean> {
        accessor.write(JSON.stringify(newValue))

        return newValue
    }

    return createReadWrite(read, write)
}

// Types ///////////////////////////////////////////////////////////////////////

export type BrowserStorageValue<V = string> = undefined | V

export interface BrowserStorageAccessorSync<V = string> extends RwSync<BrowserStorageValue<V>> {
}

export interface BrowserStorageAccessorOptions {
    storage?: undefined | Storage
    onReadError?: undefined | Io<unknown, void>
}

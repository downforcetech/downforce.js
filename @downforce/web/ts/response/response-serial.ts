import {strictArray} from '@downforce/std/array'
import {returnUndefined, tryCatch} from '@downforce/std/fn'
import {ensureNumber} from '@downforce/std/number'
import {ensureObject} from '@downforce/std/object'
import {ensureString} from '@downforce/std/string'
import type {Unsafe} from '@downforce/std/type'

export function trustResponseEncoded(response: unknown): undefined | SerialResponseEncoded {
    return tryCatch(
        (): SerialResponseEncoded => {
            const responseEncoded = ensureObject(response) as NonNullable<Unsafe<SerialResponseEncoded>>

            return {
                body: ensureString(responseEncoded.body),
                headers: strictArray(responseEncoded.headers)?.map(it =>
                    [ensureString(it?.[0]), ensureString(it?.[1])]
                ) ?? [],
                status: ensureNumber(responseEncoded.status),
                statusText: ensureString(responseEncoded.statusText),
            }
        },
        returnUndefined,
    )
}

export const ResponseCodec = {
    async encode(response: Response): Promise<SerialResponseEncoded> {
        return {
            body: await response.text(),
            headers: Array.from(response.headers.entries()),
            status: response.status,
            statusText: response.statusText,
        }
    },
    async decode(responseEncoded: SerialResponseEncoded): Promise<Response> {
        return new Response(responseEncoded.body, {
            headers: responseEncoded.headers,
            status: responseEncoded.status,
            statusText: responseEncoded.statusText,
        })
    },
}

// Types ///////////////////////////////////////////////////////////////////////

export interface SerialResponseEncoded {
    body: string
    headers: Array<[string, string]>
    status: number
    statusText: string
}

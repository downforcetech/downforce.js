import {returnUndefined} from '@downforce/std/fn-return'
import {tryCatch} from '@downforce/std/fn-try'
import {asArrayStrict} from '@downforce/std/type-as'
import {ensureNumber, ensureObject, ensureString} from '@downforce/std/type-ensure'
import type {Unsafe} from '@downforce/std/type-types'

export function asResponseEncoded(response: unknown): undefined | ResponseEncoded {
    return tryCatch(
        (): ResponseEncoded => {
            const responseEncoded = ensureObject(response) as NonNullable<Unsafe<ResponseEncoded>>

            return {
                body: ensureString(responseEncoded.body),
                headers: asArrayStrict(responseEncoded.headers)?.map(it =>
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
    async encode(response: Response): Promise<ResponseEncoded> {
        return {
            body: await response.text(),
            headers: Array.from(response.headers.entries()),
            status: response.status,
            statusText: response.statusText,
        }
    },
    async decode(responseEncoded: ResponseEncoded): Promise<Response> {
        return new Response(responseEncoded.body, {
            headers: responseEncoded.headers,
            status: responseEncoded.status,
            statusText: responseEncoded.statusText,
        })
    },
}

// Types ///////////////////////////////////////////////////////////////////////

interface ResponseEncoded {
    body: string
    headers: Array<[string, string]>
    status: number
    statusText: string
}

import type {SerialCodec} from '@downforce/std/serial'
import {ResponseCodec, type SerialResponseEncoded} from './response.js'

export * from '@downforce/std/serial'

export const SerialWebCodec: {
    Response: SerialCodec<Response, SerialResponseEncoded>
} = {
    Response: {
        id: 'Response',
        is(value) {
            return value instanceof Response
        },
        encode(response) {
            return ResponseCodec.encode(response)
        },
        decode(responseEncoded) {
            return ResponseCodec.decode(responseEncoded)
        },
    },
}

export const SerialWebCodecsList: Array<SerialCodec> = Object.values(SerialWebCodec)

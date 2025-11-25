export function encodeStringToHex(string: string): string {
    const encoder = new TextEncoder()
    const bytes = encoder.encode(string)

    return Array.from(bytes).map(it => it.toString(16).padStart(2, '0')).join('')
}

export function decodeStringFromHex(hexString: string): string {
    const hexStringsPairs = hexString.match(/.{1,2}/g) ?? []
    const bytes = new Uint8Array(hexStringsPairs.map(byte => parseInt(byte, 16)))

    const decoder = new TextDecoder()
    return decoder.decode(bytes)
}

export const Hex = {
    toHex(string: string): string {
        return encodeStringToHex(string)
    },
    fromHex(hexString: string): string {
        return decodeStringFromHex(hexString)
    },
}

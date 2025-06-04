export function isSymbol(value: unknown): value is Symbol {
    if (! value) {
        return false
    }

    const proto = Object.getPrototypeOf(value)

    if (! proto) {
        return false
    }
    if (proto.constructor !== Symbol) {
        return false
    }
    return true
}

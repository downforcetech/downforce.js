export function areEqualIdentity<T>(a: T, b: T): boolean {
    return a === b
}

export function areEqualDeepSerializable(a: any, b: any): boolean {
    const aString = JSON.stringify(a)
    const bString = JSON.stringify(b)
    return aString === bString
}

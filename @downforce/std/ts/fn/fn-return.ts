export {returnInput as identity, returnVoid as noop}

export function returnInput<V>(input: V): V {
    return input
}

export function returnVoid(): void {
}

export function returnUndefined(): undefined {
    return void undefined
}

export function returnNull(): null {
    return null
}

export function returnTrue(): true {
    return true
}

export function returnFalse(): false {
    return false
}

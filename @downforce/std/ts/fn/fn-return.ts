export function returnInput<V>(input: V): V {
    return input
}

export const identity: typeof returnInput = returnInput

export function returnUndefined(): undefined {
    return void undefined
}

export const noop: typeof returnUndefined = returnUndefined

export function returnNull(): null {
    return null
}

export function returnTrue(): true {
    return true
}

export function returnFalse(): false {
    return false
}

// export function returningValue<V>(value: V): () => V {
//     return () => value
// }

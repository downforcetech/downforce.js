export function cloneObjectShallow<O extends object>(object: O): O {
    return Object.create(
        Object.getPrototypeOf(object),
        Object.getOwnPropertyDescriptors(object),
    )
}

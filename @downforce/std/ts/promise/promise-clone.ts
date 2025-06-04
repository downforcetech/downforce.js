export function clonePromise<P>(value: P): Promise<Awaited<P>> {
    return Promise.resolve(value)
}

export function getOrInit<S, K, V>(
    store: S,
    key: K,
    args: {
        get(key: K, store: S): undefined | null | V
        init(key: K, store: S): V
        set(key: K, value: V, store: S): undefined
    },
): V {
    const {get, init, set} = args

    function setInitAndGet(): V {
        const value: V = init(key, store)

        set(key, value, store)

        return value
    }

    return get(key, store) ?? setInitAndGet()
}

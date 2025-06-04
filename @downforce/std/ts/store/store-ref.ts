export function Ref<V>(): ValueRef<undefined | V>
export function Ref<V>(value: V): ValueRef<V>
export function Ref<V>(value?: undefined | V): ValueRef<undefined | V> {
    return {value}
}

// Types ///////////////////////////////////////////////////////////////////////

export interface ValueRef<V> {
    value: V
}

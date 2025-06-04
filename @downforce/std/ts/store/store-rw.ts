// We opted out from using a `.value` getter+setter,
// because getter and setters can not be spread using the spread operator (...)
// and Object.assign() but requires a special extend utility.
// It would be an easy trap for the API consumer, who could do
// {...accessor} or
// {value, read, write} = accessor
// with consequent loss of reactivity and bugs.
export function ReadWrite<V>(read: () => Promise<V>, write: (value: V) => Promise<V>): ReadWriteAsync<V>
export function ReadWrite<V>(read: () => V, write: (value: V) => V): ReadWriteSync<V>
export function ReadWrite<V>(read: () => V, write: (value: V) => V): ReadWriteSync<V> | ReadWriteAsync<V> {
    return {read, write}
}

// Types ///////////////////////////////////////////////////////////////////////

export interface ReadWriteSync<V> {
    read(): V
    write(value: V): V
}

export interface ReadWriteAsync<V> {
    read(): Promise<V>
    write(value: V): Promise<V>
}

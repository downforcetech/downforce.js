// We opted out from using a `.value` getter/setter value,
// because getter/setter values are not preserved when used:
// - with the spread operator (...)
// - in destructuring like `const {value} = props`
// - with Object.assign().
// They require a special extend utility.
// It would be an easy trap for the API consumers.
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

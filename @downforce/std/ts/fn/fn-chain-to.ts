import type {Io} from '../fn.js'

export function chainTo<V>(chain: Io<NoInfer<V>, any>): Io<V, V> {
    return (input: V) => (chain(input), input)
}

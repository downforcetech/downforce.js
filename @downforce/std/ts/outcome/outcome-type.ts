import type {Monad} from '../monad/monad-type.js'

// Types ///////////////////////////////////////////////////////////////////////

export interface OutcomeError<E> extends Monad {
    error: E
}

export type OutcomeResultOrError<V, E> = V | OutcomeError<E>
export type OutcomeResultOf<V> = Exclude<V, OutcomeError<unknown>>
export type OutcomeErrorOf<V> = Extract<V, OutcomeError<unknown>>

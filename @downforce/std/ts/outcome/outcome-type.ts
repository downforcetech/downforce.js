import {StdError} from '../error.js'

export class OutcomeError<const E> extends StdError {
    error: E

    constructor(error: E) {
        super()
        this.error = error
    }
}

// Types ///////////////////////////////////////////////////////////////////////

export type OutcomeResultOrError<V, E> = V | OutcomeError<E>
export type OutcomeResultOf<V> = Exclude<V, OutcomeError<unknown>>
export type OutcomeErrorOf<V> = Extract<V, OutcomeError<unknown>>

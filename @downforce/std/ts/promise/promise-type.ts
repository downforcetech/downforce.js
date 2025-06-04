// Types ///////////////////////////////////////////////////////////////////////

export interface PromiseView {
    readonly pending: boolean // Not settled.
    readonly settled: boolean // Not pending.
    readonly fulfilled: boolean // Success.
    readonly rejected: boolean // Fail.
}

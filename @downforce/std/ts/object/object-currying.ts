import type {Io} from '../fn/fn-type.js'
import {omitObjectProps, pickObjectProps} from './object-mix.js'

export function pickingObjectProps<I extends object, P extends keyof I>(props: Array<P>): Io<I, Pick<I, P>> {
    return input => pickObjectProps(input, ...props)
}

export function omittingObjectProps<I extends object, P extends keyof I>(props: Array<P>): Io<I, Omit<I, P>> {
    return input => omitObjectProps(input, ...props)
}

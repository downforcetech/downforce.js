import type {Io} from '../fn.js'
import {omitObjectProps, pickObjectProps} from './object-mix.js'

export function pickObjectPropsTo<I extends object, P extends keyof I>(props: Array<P>): Io<I, Pick<I, P>> {
    return input => pickObjectProps(input, ...props)
}

export function omitObjectPropsTo<I extends object, P extends keyof I>(props: Array<P>): Io<I, Omit<I, P>> {
    return input => omitObjectProps(input, ...props)
}

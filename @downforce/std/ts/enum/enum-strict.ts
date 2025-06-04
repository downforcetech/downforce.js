import type {None} from '../optional.js'

export function strictEnum<E extends boolean | number | string, V extends E>(value: None | V, enumValues: Array<E>): undefined | V
export function strictEnum<E extends boolean | number | string>(value: unknown, enumValues: Array<E>): undefined | E
export function strictEnum<E extends boolean | number | string>(value: unknown, enumValues: Array<E>) {
    if (! enumValues.includes(value as E)) {
        return
    }
    return value
}

import type {None} from '../optional/optional-type.js'
import {trustDate} from './date-trust.js'

export function strictDate(value: None | number | string | Date): undefined | Date {
    return trustDate(value)
}

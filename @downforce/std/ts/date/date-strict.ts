import type {None} from '../optional.js'
import {trustDate} from './date-trust.js'

export function strictDate(value: None | number | string | Date): undefined | Date {
    return trustDate(value)
}

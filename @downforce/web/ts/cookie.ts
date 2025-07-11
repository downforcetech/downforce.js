import {OneSecondInMs, asDate} from '@downforce/std/date'
import {isSome, whenSome} from '@downforce/std/optional'
import {escapeRegexp} from '@downforce/std/regexp'

export const CookieKeyRegexpCache: Record<string, RegExp> = {}

export function readCookie(key: string): undefined | string {
    if (! document.cookie) {
        return
    }

    const cookie = document.cookie
    const regexp = compileCookieRegexp(key)
    const matches = cookie.match(regexp)

    if (! matches) {
        return
    }

    return matches[1]
}

export function writeCookie(args: CookieOptions & {value: string}): void {
    const key = args.key
    const value = args.value
    const path = args.path
    const maxAge = args.maxAge
    const expires = args.expires
    const sameSite = args.sameSite
    const secure = args.secure
    const customParts = args.custom
    const parts = [
        `${key}=${value}`,
        whenSome(path, path => `Path=${path}`),
        whenSome(maxAge, maxAge => `Max-Age=${maxAge}`),
        whenSome(expires, expires => `Expires=${expires}`),
        whenSome(sameSite, sameSite => `SameSite=${sameSite}`),
        secure ? 'Secure' : undefined,
        ...customParts ?? [],
    ].filter(isSome)

    const cookie = parts.join('; ')

    document.cookie = cookie
}

export function deleteCookie(args: CookieOptions): void {
    const value = ''
    const maxAge = 0
    const expires = 'Thu, 01 Jan 1970 00:00:01 GMT'

    writeCookie({...args, value, maxAge, expires})
}

export function cleanCookies(args: CookieOptions): void {
    const list = document.cookie.split(';')

    for (const keyVal of list) {
        const [key] = keyVal.trim().split('=')

        if (! key) {
            continue
        }

        deleteCookie({...args, key})
    }
}

export function maxAgeFromDate(dateOrNumber: number | Date): number {
    const dateTime = asDate(dateOrNumber).getTime()
    const maxAge = dateTime / OneSecondInMs

    return maxAge
}

export function expiresFromDate(dateOrNumber: number | Date): string {
    const date = asDate(dateOrNumber)
    const expires = date.toUTCString()

    return expires
}

export function compileCookieRegexp(key: string): RegExp {
    const regexp = CookieKeyRegexpCache[key] ?? new RegExp(`\\b${escapeRegexp(key)}=([^;]*);?`)

    CookieKeyRegexpCache[key] ??= regexp

    return regexp
}

// Types ///////////////////////////////////////////////////////////////////////

export interface Cookie {
    key: string
    get(): string | undefined
    set(value: string): void
    delete(): void
}

export interface CookieOptions {
    key: string
    path?: undefined | string
    maxAge?: undefined | number
    expires?: undefined | string
    sameSite?: undefined | string
    secure?: undefined | boolean
    custom?: undefined | Array<string>
}

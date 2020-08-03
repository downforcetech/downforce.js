import {isArray, isObject, isRegExp, isString} from '@eviljs/std-lib/type'
import {throwInvalidArgument} from '@eviljs/std-lib/error'

export const Start = '^'
export const End = '(?:/)?$'
export const All = '(.*)'
export const Arg = '([^/]+)'
export const Value = '([0-9a-zA-Z]+)'
export const Path = `/${Arg}`
export const PathOpt = `(?:${Path})?`
export const PathGlob = '(/.*)?' + End

// An opening round bracket,
// not followed by an opening or closing round bracket,
// followed by a closing round bracket.
export const CapturingGroupRegexp = /\([^()]+\)/
export const EmptiesRegexp = /[\n ]/g
export const RepeatingSlashRegexp = /\/\/+/g
export const TrailingSlashRegexp = /\/$/
export const BasePathRegexp = /^\/$/
export const EmptyRegexp = /^$/

export const RegExpCache: RegExpCache = {}

export function createRouter(observer: RouterObserver, options?: RouterOptions): Router {
    const type = options?.type ?? 'hash'

    switch (type) {
        case 'hash':
            return createHashRouter(observer, options)
        case 'history':
            return createHistoryRouter(observer, options)
        case 'memory':
            return createMemoryRouter(observer, options)
        break
    }
}

export function createHashRouter(observer: RouterObserver, options?: RouterOptions) {
    const self = {
        start() {
            window.addEventListener('hashchange', onRouteChange)
        },
        stop() {
            window.removeEventListener('hashchange', onRouteChange)
        },
        getRoute() {
            const {hash} = window.location
            const [dirtyPath, dirtyParams] = hash
                .substring(1) // Without the initial '#'.
                .split('?')
            const path = dirtyPath || '/' // The empty string is casted to the root path.
            const params = deserializeRouteParamsFromString(dirtyParams)

            return {path, params}
        },
        setRoute(path: string, params?: RouterParams) {
            const serializedRoute = '#' + serializeRouteToString(path, params)

            window.location.hash = serializedRoute
            // history.pushState(history.state, '', serializedRoute)
        },
        link(path: string, params?: RouterParams) {
            return '#' + serializeRouteToString(path, params)
        },
    }

    function onRouteChange() {
        const {path, params} = self.getRoute()

        observer(path, params)
    }

    return self
}

export function createHistoryRouter(observer: RouterObserver, options?: RouterOptions) {
    const basePath = cleanBasePath(options?.basePath)

    const self = {
        start() {
            window.addEventListener('popstate', onRouteChange)
        },
        stop() {
            window.removeEventListener('popstate', onRouteChange)
        },
        getRoute() {
            const {pathname, search} = window.location
            const path = pathname.replace(basePath, '')
            const params = deserializeRouteParamsFromString(
                search.substring(1) // Without the initial '?'.
            )

            return {path, params}
        },
        setRoute(path: string, params?: RouterParams) {
            const serializedRoute = serializeRouteToString(basePath + path, params)

            history.pushState(history.state, '', serializedRoute)
        },
        link(path: string, params?: RouterParams) {
            return serializeRouteToString(basePath + path, params)
        },
    }

    function onRouteChange() {
        const {path, params} = self.getRoute()

        observer(path, params)
    }

    return self
}

export function createMemoryRouter(observer: RouterObserver, options?: RouterOptions) {
    let routePath = options?.initMemory ?? '/'
    let routeSearch = ''

    const self = {
        start() {
        },
        stop() {
        },
        getRoute() {
            const path = routePath
            const params = deserializeRouteParamsFromString(routeSearch)

            return {path, params}
        },
        setRoute(path: string, params?: RouterParams) {
            routePath = path
            routeSearch = serializeRouteParamsToString(params)
        },
        link(path: string, params?: RouterParams) {
            return serializeRouteToString(path, params)
        },
    }

    return self
}

export function serializeRouteToString(path: string, params?: RouterParams) {
    const serializedParams = params
        ? '?' + serializeRouteParamsToString(params)
        : ''
    const serializedRoute = path + serializedParams

    return serializedRoute
}

export function serializeRouteParamsToString(params?: RouterParams): string {
    if (! params) {
        return ''
    }
    if (isString(params)) {
        return params
    }
    if (isObject(params)) {
        const parts = Object
            .keys(params)
            .map(it => `${it}=${params[it]}`)

        return serializeRouteParamsToString(parts)
    }
    if (isArray(params)) {
        return params.map(serializeRouteParamsToString).join('&')
    }

    const types = 'string | Object<string, string | number> | Array<string | Object<string, string | number>>'

    return throwInvalidArgument(
        '@eviljs/std-web/router.serializeRouteParamsToString(~~params~~):\n'
        + `params must be a ${types}, given "${params}".`
    )
}

export function deserializeRouteParamsFromString(paramsString: string) {
    const params: Record<string, string | null> = {}

    if (! paramsString) {
        return params
    }

    const parts = paramsString.split('&')

    for (const part of parts) {
        const [key, value] = part.split('=')

        params[key] = value ?? null
        // An undefined value is casted to null, to indicate its presence
        // but without a value.
    }

    return params
}

export function cleanBasePath(path?: string) {
    return path
        ? path.replace(BasePathRegexp, '')
        : ''
}

/*
* Creates a Route. Used mostly for type checking.
*
* EXAMPLE
* const route = createRoute(
*     /^\/book/\/i,
*     (id: string) => `/book/${id}`,
*     (path: string) => path.split('/').slice(2),
* )
*/
export function createRoute<E extends Args, D>(
    patternStr: string | RegExp,
    path: (...args: E) => string,
    params: (path: string) => D,
): Route<E, D>
{
    const pattern = compilePattern(patternStr)

    return {pattern, path, params}
}

/*
* Creates a Route from RegExp capturing groups.
*
* EXAMPLE
* const bookRoute = createSimpleRoute('/book/(\\w+)/(\\w+)')
* bookRoute.path(123, 'Harry-Potter') === '/book/123/Harry-Potter'
* bookRoute.params('/book/123/Harry-Potter') === ['123', 'Harry-Potter']
*/
export function createSimpleRoute(originalPattern: string): Route<Array<string | number>, Array<string>> {
    const patternString = cleanPattern(originalPattern)
    const patternExact = exact(patternString)
    const patternRegexp = regexpFromPattern(patternExact)

    function path(...args: Array<string | number>) {
        return computeRoutePath(patternString, ...args)
    }

    function params(path: string) {
        return computeRouteParams(patternRegexp, path)
    }

    const pattern = patternRegexp

    return {pattern, path, params}
}

/*
* Encodes the route parameters inside the pattern.
*
* EXAMPLE
* computeRoutePath('/book/(\\w+)/(\\w+)', 'abc', 123) === '/book/abc/123'
*/
export function computeRoutePath(patternStr: string, ...args: Array<string | number>) {
    let path = patternStr

    for (const arg of args) {
        path = path.replace(CapturingGroupRegexp, String(arg))
    }

    return path
}

/*
* Decodes the route parameters from a path.
*
* EXAMPLE
* computeRouteParams(new RegExp('/book/(\\w+)/(\\w+)'), '/book/abc/123') === ['abc', '123']
*/
function computeRouteParams(patternRe: RegExp, path: string) {
    const matches = path.match(patternRe)?.slice(1) // Without the whole matching group (first element).

    return matches ?? []
}

export function compilePattern(pattern: string | RegExp) {
    if (isRegExp(pattern)) {
        return pattern
    }

    return regexpFromPattern(cleanPattern(pattern))
}

export function cleanPattern(pattern: string) {
    return pattern
        .replace(EmptiesRegexp, '')
        .replace(RepeatingSlashRegexp, '/')
        .replace(TrailingSlashRegexp, '')
        .replace(EmptyRegexp, '/')
}

export function regexpFromPattern(pattern: string | RegExp) {
    if (isRegExp(pattern)) {
        return pattern
    }

    if (! RegExpCache[pattern]) {
        RegExpCache[pattern] = new RegExp(pattern, 'i')
    }

    return RegExpCache[pattern]
}

export function exact(pattern: string) {
    return `${Start}${pattern}${End}`
}

// Types ///////////////////////////////////////////////////////////////////////

export interface Router {
    start(): void
    stop(): void
    getRoute(): {path: string, params: RouterRouteParams}
    setRoute(path: string, params?: RouterParams): void
    link(path: string, params?: RouterParams): string
}

export interface RouterObserver {
    (route: string, params: RouterRouteParams): void
}

export interface RouterOptions {
    type?: 'hash' | 'history' | 'memory'
    basePath?: string
    initMemory?: string
}

export type RouterParams =
    | string
    | Record<string, string | number>
    | Array<string | Record<string, string | number>>

export interface RouterRouteParams extends Record<string, string | null> {
}

export interface Route<E extends Args, D> {
    pattern: RegExp
    path(...args: E): string
    params(path: string): D
}

export interface RegExpCache {
    [key: string]: RegExp
}

type Args = Array<unknown>

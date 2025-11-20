import type {ReactiveRef} from '@downforce/std/reactive'
import type {UrlParams, UrlParamsDict, UrlParamsList} from '../url/url-params.js'

// Types ///////////////////////////////////////////////////////////////////////

export interface Router {
    readonly route: ReactiveRef<RouterRoute>
    readonly started: boolean
    start(): void
    stop(): void
    /**
    * @throws InvalidArgument
    **/
    changeRoute(change: RouterRouteChange): void
    /**
    * @throws InvalidArgument
    **/
    createLink(path: string, params?: undefined | RouterRouteChangeParams): string
}

export interface RouterRoute {
    readonly path: string
    readonly params: undefined | RouterRouteParams
}

export type RouterObserver = (route: RouterRoute) => void

export interface RouterOptions {
    basePath?: undefined | string
}

export type RouterRouteParams = Record<string, undefined | string>

export interface RouterRouteChange {
    path?: undefined | string
    params?: undefined | RouterRouteChangeParams
    replace?: undefined | boolean
}

export type RouterRouteChangeParams = RouterRouteParams | UrlParams
export type RouterRouteChangeParamsDict = UrlParamsDict
export type RouterRouteChangeParamsList = UrlParamsList

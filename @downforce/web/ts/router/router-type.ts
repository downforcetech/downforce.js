import type {ReactiveRef} from '@downforce/std/reactive'
import type {UrlParams, UrlParamsDict, UrlParamsList} from '../url/url-params.js'

// Types ///////////////////////////////////////////////////////////////////////

export interface Router<S = unknown> {
    readonly route: ReactiveRef<RouterRoute<S>>
    readonly started: boolean
    start(): void
    stop(): void
    /**
    * @throws InvalidArgument
    **/
    changeRoute(change: RouterRouteChange<S>): void
    /**
    * @throws InvalidArgument
    **/
    createLink(path: string, params?: undefined | RouterRouteChangeParams): string
}

export interface RouterRoute<S = unknown> {
    readonly path: string
    readonly params: undefined | RouterRouteParams
    readonly state: undefined | S
}

export type RouterObserver<S = unknown> = (route: RouterRoute<S>) => void

export interface RouterOptions {
    basePath?: undefined | string
}

export type RouterRouteParams = Record<string, undefined | string>

export interface RouterRouteChange<S = unknown> {
    path?: undefined | string
    params?: undefined | RouterRouteChangeParams
    state?: undefined | undefined | S
    replace?: undefined | boolean
}

export type RouterRouteChangeParams = RouterRouteParams | UrlParams
export type RouterRouteChangeParamsDict = UrlParamsDict
export type RouterRouteChangeParamsList = UrlParamsList

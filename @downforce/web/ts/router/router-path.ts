import {createReactiveRef} from '@downforce/std/reactive'
import {asBaseUrl} from '../url/url-path.js'
import {mergeRouteChange, areSameRoutes, encodeLink, decodeRouteParams} from './router-mix.js'
import type {RouterOptions, Router, RouterRouteChangeParams, RouterRoute} from './router-type.js'

export function createPathRouter<S = unknown>(options?: undefined | RouterOptions): Router {
    const basePath = asBaseUrl(options?.basePath)
    let active = false

    function onRouteChange() {
        self.route.value = decodePathRoute(basePath)
    }

    const self: Router = {
        route: createReactiveRef(decodePathRoute(basePath)),

        get started() {
            return active
        },
        start() {
            if (active) {
                return
            }

            active = true
            self.route.value = decodePathRoute(basePath)
            window.addEventListener('popstate', onRouteChange)
        },
        stop() {
            active = false
            window.removeEventListener('popstate', onRouteChange)
        },
        changeRoute(routeChange) {
            const nextRoute = mergeRouteChange(self.route.value, routeChange)

            if (areSameRoutes(self.route.value, nextRoute)) {
                return
            }

            self.route.value = nextRoute

            const routeString = self.createLink(self.route.value.path, self.route.value.params)

            // The History mutation does not trigger the PopState event.
            if (routeChange.replace) {
                history.replaceState(null, '', routeString)
            }
            else {
                history.pushState(null, '', routeString)
            }
        },
        createLink(path: string, params?: undefined | RouterRouteChangeParams) {
            return encodeLink(basePath + path, params)
        },
    }

    return self
}

export function decodePathRoute(basePath: string): RouterRoute {
    const {pathname, search} = window.location
    const path = basePath
        ? pathname.slice(basePath.length) // pathname.replace(basePath, '')
        : pathname
    const params = decodeRouteParams(
        search.substring(1) // Without the initial '?'.
    )
    return {path, params}
}

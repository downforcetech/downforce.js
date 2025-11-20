import {createReactiveRef} from '@downforce/std/reactive'
import {areSameRoutes, encodeLink, mergeRouteChange} from './router-mix.js'
import type {Router, RouterOptions, RouterRouteChangeParams, RouterRouteParams} from './router-type.js'

export function createMemoryRouter<S = unknown>(options?: undefined | RouterMemoryOptions): Router {
    let active = false

    const self: Router = {
        route: createReactiveRef({
            path: options?.initialPath ?? '/',
            params: options?.initialParams,
        }),
        get started() {
            return active
        },
        start() {
            active = true
        },
        stop() {
            active = false
        },
        changeRoute(routeChange) {
            const nextRoute = mergeRouteChange(self.route.value, routeChange)

            if (areSameRoutes(self.route.value, nextRoute)) {
                return
            }

            self.route.value = nextRoute
        },
        createLink(path: string, params?: undefined | RouterRouteChangeParams) {
            return encodeLink(path, params)
        },
    }

    return self
}

// Types ///////////////////////////////////////////////////////////////////////

export interface RouterMemoryOptions extends RouterOptions {
    initialPath?: undefined | string
    initialParams?: undefined | RouterRouteParams
}

import {arrayWrap} from '@downforce/std/array'
import {compute, type Computable, type Fn, type Io, type Task} from '@downforce/std/fn'
import {isDefined} from '@downforce/std/optional'
import {isPromise} from '@downforce/std/promise'
import {escapeRegexp} from '@downforce/std/regexp'
import {exact, matchRoutePattern, testRoutePattern, type RoutePattern, type RoutePatterns} from '@downforce/web/route'
import type {Router, RouterRoute, RouterRouteChange, RouterRouteChangeParams, RouterRouteChangeParamsDict, RouterRouteParams} from '@downforce/web/router'
import {encodeLink} from '@downforce/web/router'
import {isUrlWithScheme} from '@downforce/web/url'
import {Children, isValidElement, useCallback, useContext, useEffect, useMemo, useRef} from 'react'
import {classes} from './classes.js'
import {defineContext} from './ctx.js'
import type {ElementProps, Props} from './props.js'
import {useReactiveSelect} from './reactive.js'

export * from '@downforce/web/route'
export * from '@downforce/web/router'

export const RouterContext: React.Context<undefined | Router> = defineContext<Router>('RouterContext')
export const RouteMatchContext: React.Context<undefined | RouteArgs> = defineContext<RouteArgs>('RouteMatchContext')

/*
* EXAMPLE
*
* const options = {type, basePath}
*
* <RouterProvider options={options}>
*     <MyApp/>
* </RouterProvider>
*/
export function RouterProvider(props: Props<RouterProviderProps>): React.JSX.Element {
    const {children, router} = props

    useEffect(() => {
        router.start() // Router must not be stopped on unmount.
    }, [router])

    return <RouterContext value={router} children={children}/>
}

/*
* EXAMPLE
*
* <WhenRoute is="^/$">
*     <h1>/ exact</h1>
* </WhenRoute>
* <WhenRoute is="^/book">
*     <h1>/book*</h1>
* </WhenRoute>
* <WhenRoute is={`${MatchStart}/book${MatchEnd}`}>
*     <h1>/book exact</h1>
* </WhenRoute>
* <WhenRoute is={exact('/book')}>
*     <h1>/book exact</h1>
* </WhenRoute>
* <WhenRoute is={new RegExp('^/book(?:/)?$', 'i')}>
*     <h1>/book</h1>
* </WhenRoute>
* <WhenRoute is={exact('/book/${Arg}/${Arg}${MatchEnd}')}>
*     {(arg1, arg2) =>
*         <h1>/book/{arg1}/{arg2}</h1>
*     }
* </WhenRoute>
*/
export function WhenRoute(props: Props<WhenRouteProps>): undefined | React.JSX.Element {
    const {children, is} = props
    const {matchRoutePath} = useRoutePathTest()

    const routeArgs = useMemo((): undefined | RouteArgs => {
        for (const pattern of arrayWrap(is)) {
            const routeMatches = matchRoutePath(pattern)

            if (! routeMatches) {
                continue
            }

            return routeMatches.slice(1) // Without whole match.
        }

        return // Makes TypeScript happy.
    }, [is, matchRoutePath])

    if (! routeArgs) {
        return
    }

    return (
        <RouteMatchContext value={routeArgs}>
            {compute(children, ...routeArgs)}
        </RouteMatchContext>
    )
}

/*
* EXAMPLE
*
* <SwitchRoute fallback={() => <NotFoundView/>}>
*     <CaseRoute is={new RegExp(`^/book/${Arg}/${Arg}`, 'i')}>
*         {(arg1, arg2) => (
*             <h1>/book/{arg1}/{arg2}</h1>
*         )}
*     </CaseRoute>
*     <CaseRoute is={`${MatchStart}/book${MatchEnd}`}>
*         <h1>/book exact</h1>
*     </CaseRoute>
*     <CaseRoute is={exact('/book')}>
*         <h1>/book exact</h1>
*     </CaseRoute>
*     <CaseRoute is={'^/book'}>
*         <h1>/book*</h1>
*     </CaseRoute>
*     <CaseRoute is={'^/$'}>
*         <h1>/ exact</h1>
*     </CaseRoute>
*     <CaseRoute is={'^/'}>
*         <h1>/*</h1>
*     </CaseRoute>
* </SwitchRoute>
*/
export function SwitchRoute(props: Props<SwitchRouteProps>): React.JSX.Element {
    const {children, fallback} = props
    const {routePath, matchRoutePath} = useRoutePathTest()

    interface RouteMatch {
        key: undefined | React.Key
        child: undefined | RouteMatchChildren
        args: RouteArgs,
    }

    const match = useMemo((): RouteMatch => {
        const candidates = Children.toArray(children).filter(isCaseRouteElement)

        for (const candidate of candidates) {
            const candidatePatterns = arrayWrap(candidate.props.is)

            for (const pattern of candidatePatterns) {
                const routeMatches = matchRoutePath(pattern)

                if (! routeMatches) {
                    continue
                }

                return {
                    key: candidate.key ?? undefined,
                    child: candidate.props.children,
                    args: routeMatches.slice(1), // Without whole match.
                }
            }
        }

        return {
            key: undefined,
            child: compute(fallback, routePath),
            args: [],
        }
    }, [children, matchRoutePath, routePath])

    const {key, args} = match
    const child = compute(match.child, ...args)

    return <RouteMatchContext key={key} value={args} children={child}/>
}

export function CaseRoute(props: Props<CaseRouteProps>): undefined {
}

/*
* EXAMPLE
*
* <Route path="/book/123" if={formSaved}>
*     <button>Click</button>
* </Route>
* <Route path="/book/123" if={() => formSaved ? true : false}>
*     <button>Click</button>
* </Route>
* <Route path="/book/123" if={() => Promise.resolve(formSaved)}>
*     <button>Click</button>
* </Route>`
* <Route params={{...route.params, id: 123}}>
*     <button>Click</button>
* </Route>`
*/
export function Route(props: Props<RouteProps>): React.JSX.Element {
    const {
        activeExact,
        className,
        if: guard,
        params,
        replace: replaceOptional,
        path,
        ...otherProps
    } = props
    const replace = replaceOptional ?? false

    const {changeRoute, link} = useRouter()
    const {testRoutePath} = useRoutePathTest()
    const currentRoutePath = useRoutePath()

    const pathOrCurrentPath = path ?? currentRoutePath

    const href = useMemo(() => {
        return link(pathOrCurrentPath, params)
    }, [pathOrCurrentPath, params])

    const active = useMemo(() => {
        if (! path) {
            return false
        }

        const pathEscaped = escapeRegexp(path)
        const pathPattern = activeExact ? exact(pathEscaped) : pathEscaped

        return testRoutePath(pathPattern)
    }, [path, testRoutePath])

    const onClick = useCallback((event: React.MouseEvent) => {
        if (event.defaultPrevented) {
            // Default behavior has been prevented. We must stop.
            return
        }

        event.preventDefault()

        function tryRouting(result: undefined | boolean) {
            if (result === false) {
                // Routing is blocked only in case of false return value.
                return
            }

            changeRoute({path: path, params, replace})
        }

        const guardResult = compute(guard)

        if (isPromise(guardResult)) {
            // Async behavior.
            guardResult.then(tryRouting)
        }
        else {
            // Sync behavior.
            tryRouting(guardResult)
        }
    }, [changeRoute, path, params, replace, guard])

    return (
        <a
            // Overridable properties.
            data-active={active}
            onClick={onClick}
            {...otherProps}
            className={classes('Route-84a4', className)}
            href={href}
        />
    )
}

export function Link(props: Props<LinkProps>): React.JSX.Element {
    const {className, params, path, replace, ...otherProps} = props

    const pathIsUrlWithScheme = isDefined(path) && isUrlWithScheme(path)

    if (pathIsUrlWithScheme) {
        return (
            <a
                target="_blank"
                data-link-type="link"
                {...otherProps}
                className={classes('Link-b705', className)}
                href={encodeLink(path, params)}
            />
        )
    }

    return (
        <Route
            data-link-type="route"
            {...otherProps}
            className={classes('Link-b705', className)}
            path={path}
            params={params}
            replace={replace}
        />
    )
}

export function Redirect(props: Props<RedirectProps>): React.ReactNode {
    const {children, params, path, replace: replaceOptional} = props
    const replace = replaceOptional ?? true

    const {changeRoute} = useRouter()

    useEffect(() => {
        if (! path && ! params) {
            return
        }

        changeRoute({path: path, params: params, replace: replace})
    }, [])

    return children
}

export function useRouterContext(): undefined | Router {
    return useContext(RouterContext as React.Context<undefined | Router>)
}

export function useRouter(): RouterManager {
    const routerContext = useRouterContext()!

    const readRoute = useRouteRead()

    const changeRoute = useCallback((args: RouterRouteChangeComputable) => {
        const {params, ...otherArgs} = args
        const paramsComputed = compute(params, readRoute().params)

        routerContext.changeRoute({...otherArgs, params: paramsComputed})
    }, [routerContext, readRoute])

    const link = useRouterLink()

    return {changeRoute, link, readRoute}
}

export function useRouteParamsPatch(): (paramsPatch: undefined | RouterRouteChangeParamsDict, replace?: undefined | boolean) => void {
    const {changeRoute} = useRouter()

    const patchRoute = useCallback((paramsPatch: undefined | RouterRouteChangeParamsDict, replace?: undefined | boolean) => {
        if (! paramsPatch) {
            return
        }

        changeRoute({
            params: params => ({
                ...params,
                ...paramsPatch,
            }),
            replace: replace ?? false,
        })
    }, [changeRoute])

    return patchRoute
}

export function useRouterLink(): (path: string, params?: undefined | RouterRouteChangeParams) => string {
    const routerContext = useRouterContext()!

    return routerContext.createLink
}

export function useRoute(): RouteManager {
    return {
        routePath: useRoutePath(),
        routeParams: useRouteParams(),
        routeArgs: useRouteArgs(),
    }
}

export function useRouteRead(): Task<RouterRoute> {
    const routerContext = useRouterContext()!

    const readRoute = useCallback(() => {
        return routerContext.route.value
    }, [routerContext])

    return readRoute
}

export function useRoutePath(): RouterRoute['path'] {
    const routerContext = useRouterContext()!
    const routePath = useReactiveSelect(routerContext.route, RouterSelectors.selectRoutePath)

    return routePath
}

export function useRouteParam<R>(selectRouteParam: Io<undefined | RouterRouteParams, R>): R {
    const routerContext = useRouterContext()!

    const selector = useCallback((route: RouterRoute) => {
        return selectRouteParam(route.params)
    }, [selectRouteParam])

    const selectedRouteParam = useReactiveSelect(routerContext.route, selector)

    return selectedRouteParam
}

export function useRouteParams(): RouterRoute['params'] {
    const routerContext = useRouterContext()!
    const routeParams = useReactiveSelect(routerContext.route, RouterSelectors.selectRouteParams)

    return routeParams
}

export function useRouteArgs(): RouteArgs {
    return useContext(RouteMatchContext)!
}

export function useRoutePathTest(): RoutePathTester {
    const routePath = useRoutePath()

    const testRoutePath = useCallback((pattern: RoutePattern) => {
        return testRoutePattern(routePath, pattern)
    }, [routePath])

    const matchRoutePath = useCallback((pattern: RoutePattern) => {
        return matchRoutePattern(routePath, pattern)
    }, [routePath])

    return {
        routePath,
        testRoutePath,
        matchRoutePath,
    }
}

export function useRouteTransition(): {
    fromRoute: string
    toRoute: string
} {
    const routePath = useRoutePath()
    const toRoute = routePath
    const prevRouteRef = useRef(toRoute)

    useEffect(() => {
        prevRouteRef.current = toRoute
    }, [toRoute])

    const transition = useMemo(() => {
        const fromRoute = prevRouteRef.current
        return {fromRoute, toRoute}
    }, [toRoute])

    return transition
}

function isCaseRouteElement(element: unknown): element is React.ReactElement<CaseRouteProps, typeof CaseRoute> {
    if (! isValidElement(element)) {
        return false
    }
    if (element.type !== CaseRoute) {
        return false
    }
    return true
}

export const RouterSelectors = {
    selectRoutePath(route: RouterRoute): string {
        return route.path
    },
    selectRouteParams(route: RouterRoute): undefined | RouterRouteParams {
        return route.params
    },
}

// Types ///////////////////////////////////////////////////////////////////////

export interface RouterProviderProps {
    children: undefined | React.ReactNode
    router: Router
}

export interface RouterProviderProps {
    children: undefined | React.ReactNode
    router: Router
}

export interface RouteArgsProviderProps {
    children: undefined | React.ReactNode
    value: RouteArgs
}

export interface WhenRouteProps {
    children: undefined | RouteMatchChildren
    is: RoutePatterns
}

export interface SwitchRouteProps {
    children: undefined | React.ReactNode
    fallback?: undefined | Computable<React.ReactNode, [RouterRoute['path']]>
}

export interface CaseRouteProps extends WhenRouteProps {
    key?: undefined | React.Key
}

export interface RouteProps extends RoutingProps, ElementProps<'a'> {
    activeExact?: undefined | boolean
    children: undefined | React.ReactNode
    if?: undefined | Computable<RouteGuardResult>
}

export interface LinkProps extends RoutingProps, ElementProps<'a'> {
    children: undefined | React.ReactNode
}

export interface RedirectProps extends RoutingProps {
    children?: undefined | React.ReactNode
}

export interface RoutingProps extends Omit<RouterRouteChange, 'path'> {
    path?: undefined | RouterRouteChange['path']
    params?: undefined | RouterRouteChange['params']
    replace?: undefined | RouterRouteChange['replace']
}

export interface RouterManager {
    changeRoute(args: RouterRouteChangeComputable): void
    link(path: string, params?: undefined | RouterRouteChangeParams): string
    readRoute(): RouterRoute
}

export interface RouteManager {
    routePath: RouterRoute['path']
    routeParams: RouterRoute['params']
    routeArgs: RouteArgs
}

export interface RoutePathTester {
    routePath: RouterRoute['path']
    testRoutePath(pattern: RoutePattern): boolean
    matchRoutePath(pattern: RoutePattern): undefined | RegExpMatchArray
}

export interface RouterRouteChangeComputable extends Omit<RouterRouteChange, 'params'> {
    params?: undefined | Computable<
        undefined | RouterRouteChangeParams,
        [routeParams: undefined | RouterRouteParams]
    >
}

export type RouteMatchChildren =
    | React.ReactNode
    | Fn<RouteArgs, React.ReactNode>

export type RouteArgs = Array<undefined | string>

export type RouteGuardResult = undefined | boolean | Promise<boolean>

export interface RouteMatch {
    child: undefined | RouteMatchChildren
    args: RouteArgs
}

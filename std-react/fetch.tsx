import {createContext, createElement, useContext} from 'react'
import {Fetch} from '@eviljs/std-web/fetch'

export const FetchContext = createContext<Fetch>(void undefined as any)

/*
* EXAMPLE
*
* const fetch = createFetch({baseUrl: '/api'})
* const main = WithFetch(MyMain, fetch)
*
* render(<main/>, document.body)
*/
export function WithFetch(Child: React.ElementType, fetch: Fetch) {
    function FetchProviderProxy(props: any) {
        return withFetch(<Child {...props}/>, fetch)
    }

    return FetchProviderProxy
}

/*
* EXAMPLE
*
* export function MyMain(props) {
*     const fetch = createFetch({baseUrl: '/api'})
*     const main = withFetch(<MyMain/>, fetch)
*
*     return <main/>
* }
*/
export function withFetch(children: React.ReactNode, fetch: Fetch) {
    return (
        <FetchContext.Provider value={fetch}>
            {children}
        </FetchContext.Provider>
    )
}

/*
* EXAMPLE
*
* export function MyMain(props) {
*     const fetch = createFetch({baseUrl: '/api'})
*
*     return (
*         <FetchProvider fetch={fetch}>
*             <MyApp/>
*         </FetchProvider>
*     )
* }
*/
export function FetchProvider(props: FetchProviderProps) {
    return withFetch(props.children, props.fetch)
}

export function useFetch() {
    return useContext(FetchContext)
}

// Types ///////////////////////////////////////////////////////////////////////

export interface FetchProviderProps {
    children: React.ReactNode
    fetch: Fetch
}

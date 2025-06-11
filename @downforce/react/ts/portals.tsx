import {useCallback, useContext, useEffect, useMemo} from 'react'
import {createPortal} from 'react-dom'
import {Box, type BoxProps} from './box.js'
import {defineContext} from './ctx.js'
import {useStateTransition, type StateAccessorManager} from './state.js'

export const PortalsContext: React.Context<undefined | StateAccessorManager<Portals>> = defineContext<StateAccessorManager<Portals>>('PortalsContext')

/*
* EXAMPLE
*
* return (
*     <PortalsProvider>
*         <Portal name="main"/>
*
*         <Teleport to="main">
*             <p>This code is teleported inside the Portal</p>
*         </Teleport>
*     </PortalsProvider>
* )
*/
export function PortalsProvider(props: PortalsProviderProps): React.JSX.Element {
    const {children} = props
    const contextValue = usePortalsProvider()

    return <PortalsContext value={contextValue} children={children}/>
}

/*
* EXAMPLE
*
* return (
*     <PortalsProvider>
*         <Portal name="main"/>
*
*         <Teleport to="main">
*             <p>This code is teleported inside the Portal</p>
*         </Teleport>
*     </PortalsProvider>
* )
*/
export function Portal(props: PortalProps): React.JSX.Element {
    const {name, ...otherProps} = props
    const [, setPortals] = useContext(PortalsContext)!

    const onRef = useCallback((element: null | Element) => {
        setPortals(state => ({
            ...state,
            [name]: element,
        }))
    }, [name, setPortals])

    useEffect(() => {
        function onClean() {
            setPortals(state => ({
                ...state,
                [name]: null,
            }))
        }

        return onClean
    }, [name])

    return <Box {...otherProps} ref={onRef}/>
}

/*
* EXAMPLE
*
* return (
*     <PortalsProvider>
*         <Portal name="main"/>
*
*         <Teleport to="main">
*             <p>This code is teleported inside the Portal</p>
*         </Teleport>
*     </PortalsProvider>
* )
*/
export function Teleport(props: TeleportProps): undefined | React.ReactPortal {
    const {to, children} = props
    const [portals] = useContext(PortalsContext)!
    const portal = portals[to]

    if (! portal) {
        return
    }

    return createPortal(children, portal)
}

export function usePortalsProvider(): StateAccessorManager<Portals> {
    const [portals, setPortals, getPortals] = useStateTransition<Portals>({})

    return useMemo(() => [portals, setPortals, getPortals], [portals, setPortals, getPortals])
}

// Types ///////////////////////////////////////////////////////////////////////

export type PortalElement = Element
export type Portals = Record<PortalId, null | PortalElement>
export type PortalId = PropertyKey

export interface PortalsProviderProps {
    children?: undefined | React.ReactNode
}

export interface PortalProps extends Omit<BoxProps, 'name'> {
    name: PortalId
}

export interface TeleportProps {
    children: React.ReactNode
    to: PortalId
}

import type {FIX} from '@downforce/std/type'
import {useContext, useMemo} from 'react'
import {createPortal} from 'react-dom'
import {Box, type BoxProps} from './box.js'
import {defineContext} from './ctx.js'
import {useState3, type UseState3Contract, type StateWriterArg} from './state.js'

export const PortalContext: React.Context<undefined | UseState3Contract<null | PortalElement>> =
    defineContext<UseState3Contract<null | PortalElement>>('PortalContext')

export function PortalProvider(props: PortalProviderProps): React.JSX.Element {
    const {children} = props
    const contextValue = usePortalProvider()

    return <PortalContext value={contextValue} children={children}/>
}

/*
* EXAMPLE
*
* export function MyMain(props) {
*     return withPortal(Portal =>
*         <Fragment>
*             <Teleport>
*                 <p>This code is teleported inside the Portal</p>
*             </Teleport>
*
*             <Portal/>
*         </Fragment>
*     )
* }
*/
export function Portal(props: PortalProps): React.JSX.Element {
    const [, setPortal] = useContext(PortalContext)!

    return (
        <Box
            {...props}
            ref={setPortal as FIX<(value: StateWriterArg<null | PortalElement>) => void>}
        />
    )
}

/*
* EXAMPLE
*
* return (
*     <PortalProvider children={Portal =>
*         <Fragment>
*             <Teleport>
*                 <p>This code is teleported inside the Portal</p>
*             </Teleport>
*
*             <Portal/>
*         </Fragment>
*     }/>
* )
*/
export function Teleport(props: TeleportProps): undefined | React.ReactPortal {
    const {children} = props
    const [portal] = useContext(PortalContext)!

    if (! portal) {
        return
    }

    return createPortal(children, portal)
}

export function usePortalProvider(): UseState3Contract<null | PortalElement> {
    const [element, setElement, getElement] = useState3<null | PortalElement>(null)

    return useMemo(() => [element, setElement, getElement], [element, setElement, getElement])
}

// Types ///////////////////////////////////////////////////////////////////////

export type PortalElement = Element

export interface PortalProviderProps {
    children: undefined | React.ReactNode
}

export interface PortalProps extends BoxProps {
}

export interface TeleportProps {
    children: React.JSX.Element
}

import {isValidElement} from 'react'

export function tryElement<P extends object = {}>(node: ReactNode<P>): undefined | ReactElement<P, unknown> {
    if (! isValidElement(node)) {
        return
    }
    return node as ReactElement<P, unknown>
}

export function areElementsEqual(left: undefined | ReactElement<any, any>, right: undefined | ReactElement<any, any>): boolean {
    if (! left && ! right) {
        return true
    }
    if (! left || ! right) {
        return false
    }

    const sameType = left.type === right.type
    const sameKey = left.key === right.key

    return sameType && sameKey
}

export function decoratingElement(args: {
    before?: undefined | React.ReactNode
    after?: undefined | React.ReactNode
}): (children: React.ReactNode) => React.JSX.Element {
    function decorator(children: React.ReactNode) {
        return <>
            {args?.before}
            {children}
            {args?.after}
        </>
    }

    return decorator
}

export function decoratingElementBefore(children: React.ReactNode): (children: React.ReactNode) => React.JSX.Element {
    return decoratingElement({before: children})
}

export function decoratingElementAfter(children: React.ReactNode): (children: React.ReactNode) => React.JSX.Element {
    return decoratingElement({after: children})
}

// Types ///////////////////////////////////////////////////////////////////////

export type ReactNode<P extends object = object> = undefined | null | boolean | number | string | React.JSX.Element | React.ReactElement<P, React.JSXElementConstructor<any>>
export type ReactElement<P extends object = object, C = unknown> = React.ReactElement<P, React.JSXElementConstructor<C>>
export type ReactMixedElement = React.JSX.Element | React.ReactElement<unknown, React.JSXElementConstructor<any>>

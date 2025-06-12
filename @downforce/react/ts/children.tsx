import {isValidElement} from 'react'

export function strictElement<P extends object = {}>(node: ReactNode<P>): undefined | ReactElement<P, unknown> {
    if (! isValidElement(node)) {
        return
    }
    return node as ReactElement<P, unknown>
}

export function areElementsEqual(first: undefined | ReactElement<any, any>, second: undefined | ReactElement<any, any>): boolean {
    if (! first && ! second) {
        return true
    }
    if (! first || ! second) {
        return false
    }

    const sameType = first.type === second.type
    const sameKey = first.key === second.key

    return sameType && sameKey
}

export function decorateElementWith(args: {
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

export function decorateElementBeforeWith(children: React.ReactNode): (children: React.ReactNode) => React.JSX.Element {
    return decorateElementWith({before: children})
}

export function decorateElementAfterWith(children: React.ReactNode): (children: React.ReactNode) => React.JSX.Element {
    return decorateElementWith({after: children})
}

// Types ///////////////////////////////////////////////////////////////////////

export type ReactNode<P extends object = object> = undefined | null | boolean | number | string | React.JSX.Element | React.ReactElement<P, React.JSXElementConstructor<any>>
export type ReactElement<P extends object = object, C = unknown> = React.ReactElement<P, React.JSXElementConstructor<C>>
export type ReactElementMixed = React.JSX.Element | React.ReactElement<unknown, React.JSXElementConstructor<any>>

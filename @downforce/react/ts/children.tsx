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

export function createElementDecorator(args: {
    after?: undefined | React.ReactNode
    before?: undefined | React.ReactNode
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

export function createElementAfterDecorator(children: React.ReactNode): (children: React.ReactNode) => React.JSX.Element {
    return createElementDecorator({after: children})
}

export function createElementBeforeDecorator(children: React.ReactNode): (children: React.ReactNode) => React.JSX.Element {
    return createElementDecorator({before: children})
}

// Types ///////////////////////////////////////////////////////////////////////

export type ReactNode<P extends object = object> = undefined | null | boolean | number | string | React.JSX.Element | React.ReactElement<P, React.JSXElementConstructor<any>>
export type ReactElement<P extends object = object, C = unknown> = React.ReactElement<P, React.JSXElementConstructor<C>>
export type ReactElementMixed = React.JSX.Element | React.ReactElement<unknown, React.JSXElementConstructor<any>>

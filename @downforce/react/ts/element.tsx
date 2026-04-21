import type {Io} from '@downforce/std/fn'
import {isValidElement} from 'react'

export function strictElement<P extends object = object>(node: ReactNode<P>): undefined | ReactElement<P, unknown> {
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

export function decorateElementWith(
    before?: undefined | React.ReactNode,
    after?: undefined | React.ReactNode,
): Io<React.ReactNode, React.JSX.Element> {
    function decorator(children: React.ReactNode) {
        return <>
            {before}
            {children}
            {after}
        </>
    }

    return decorator
}

export function decorateElementBefore(children: React.ReactNode): Io<React.ReactNode, React.JSX.Element> {
    return decorateElementWith(children, undefined)
}

export function decorateElementAfter(children: React.ReactNode): Io<React.ReactNode, React.JSX.Element> {
    return decorateElementWith(undefined, children)
}

// Types ///////////////////////////////////////////////////////////////////////

export type ReactNode<P extends object = object> = undefined | null | boolean | number | string | React.JSX.Element | React.ReactElement<P, React.JSXElementConstructor<any>>
export type ReactElement<P extends object = object, C = unknown> = React.ReactElement<P, React.JSXElementConstructor<C>>
export type ReactElementMixed = React.JSX.Element | React.ReactElement<unknown, React.JSXElementConstructor<any>>

import {isValidElement, type ComponentProps} from 'react'

export function isElementType<T extends React.JSXElementConstructor<any>>(
    element: React.ReactNode,
    type: T,
): element is React.ReactElement<ComponentProps<T>, T> {
    return isValidElement(element) && element.type === type
}

// Types ///////////////////////////////////////////////////////////////////////

export interface ValueMutator<V, C = V, R = undefined> {
    value: V
    onChange: (value: C) => R
}

export interface ItemSelector<I, V, C = V, R = undefined> {
    items: Array<I>
    selected: V
    onSelect: (value: C, idx: number) => R
}

import {classes} from '@downforce/react/classes'
import type {ElementProps, Props} from '@downforce/react/props'
import {HtmlSandbox as HtmlSandboxElement} from '@downforce/webx/html-sandbox'
import {createElement} from 'react'

export const HtmlSandboxTag = 'html-sandbox'

export function HtmlSandbox(props: Props<HtmlSandboxProps>): React.JSX.Element {
    const {children, className, tag, ...otherProps} = props

    return (
        createElement(tag ?? HtmlSandboxTag, {
            ...otherProps,
            class: classes('HtmlSandbox-d25f', className),
        }, children)
    )
}

export function defineHtmlSandbox(tagOptional?: undefined| string): void {
    const tag = tagOptional ?? HtmlSandboxTag

    if (! customElements.get(tag)) { // HMR Compatibility.
        customElements.define(tag, HtmlSandboxElement)
    }
}

// Types ///////////////////////////////////////////////////////////////////////

export interface HtmlSandboxProps extends ElementProps<'div'> {
    tag?: undefined | string
    children: string
}

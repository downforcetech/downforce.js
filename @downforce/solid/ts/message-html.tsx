import {isString} from '@downforce/std/string'
import {splitProps, type JSX} from 'solid-js'
import {classes} from './classes.js'
import {Html} from './html.jsx'
import {createMessage, type MessageProps} from './message.jsx'

export function MessageHtml(props: MessageHtmlProps): JSX.Element {
    const [_, otherProps] = splitProps(props, ['args', 'children'])

    const message = createMessage(
        () => isString(props.children)
            ? props.children
            : undefined
        ,
        props.args,
    )

    return (
        <Html
            {...otherProps}
            class={classes('TextHtml-a9b5', props.class)}
            data-key={message() !== props.children
                ? props.children
                : undefined
            }
        >
            {message()}
        </Html>
    )
}

// Types ///////////////////////////////////////////////////////////////////////

export interface MessageHtmlProps extends MessageProps {
}

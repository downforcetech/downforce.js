import {classes} from '@downforce/react/classes'
import type {ElementProps, Props} from '@downforce/react/props'

export function NotificationBadge(props: Props<NotificationBadgeProps>): React.JSX.Element {
    const {children, className, value, ...otherProps} = props

    return (
        <span
            {...otherProps}
            className={classes('NotificationBadge-3046', className)}
        >
            <span className="value-3db7">
                {value}
            </span>
        </span>
    )
}

// Types ///////////////////////////////////////////////////////////////////////

export interface NotificationBadgeProps extends ElementProps<'span'> {
    value: number | string
}

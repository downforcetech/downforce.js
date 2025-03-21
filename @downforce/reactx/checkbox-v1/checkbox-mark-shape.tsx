import {classes} from '@downforce/react/classes'
import type {ElementProps, Props} from '@downforce/react/props'
import type {CheckboxModel} from './checkbox.js'

export function CheckboxMark(props: Props<CheckboxMarkProps>): React.JSX.Element {
    const {className, ...otherProps} = props

    return (
        <span
            {...otherProps}
            className={classes('CheckboxMark-67ba', className)}
        />
    )
}

// Types ///////////////////////////////////////////////////////////////////////

export interface CheckboxMarkProps extends ElementProps<'span'>, CheckboxModel {
}

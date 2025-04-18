import {classes} from '@downforce/react/classes'
import type {ElementProps, Props} from '@downforce/react/props'

export function Button(props: Props<ButtonProps>): React.JSX.Element {
    const {className, ...otherProps} = props

    return (
        <button
            type="button"
            {...otherProps}
            className={classes('Button-db00 std-button std-text-button', className)}
        />
    )
}

// Types ///////////////////////////////////////////////////////////////////////

export interface ButtonProps extends ElementProps<'button'> {
}

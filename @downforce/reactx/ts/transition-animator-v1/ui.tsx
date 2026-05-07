import {Box, type BoxProps} from '@downforce/react/box'
import {classes} from '@downforce/react/classes'
import type {Props} from '@downforce/react/props'
import {Enum, type UnionOf} from '@downforce/std/enum'

export const TransitionEffectEnum: {
    Fade: 'std-transition-fade'
    Leak: 'std-transition-leak'
    None: 'std-transition-none'
    SkidLeft: 'std-transition-skid-left'
    Zoom: 'std-transition-zoom'
} = Enum({
    Fade: 'std-transition-fade',
    Leak: 'std-transition-leak',
    None: 'std-transition-none',
    SkidLeft: 'std-transition-skid-left',
    Zoom: 'std-transition-zoom',
})

export function TransitionAnimator(props: Props<TransitionAnimatorProps>): React.JSX.Element {
    const {className, effect, ...otherProps} = props

    return (
        <Box
            {...otherProps}
            className={classes('TransitionAnimator-262e89', className, effect)}
        />
    )
}

// Types ///////////////////////////////////////////////////////////////////////

export interface TransitionAnimatorProps extends BoxProps {
    effect: UnionOf<typeof TransitionEffectEnum>
}

import {Box, type BoxProps} from '@downforce/react/box'
import {useBrowserFeatures} from '@downforce/react/browser'
import {classes} from '@downforce/react/classes'
import {useScrollHorizontal} from '@downforce/react/drag'
import {useMergeRefs} from '@downforce/react/ref'
import {isUndefined} from '@downforce/std/type-is'
import {useMemo, useRef} from 'react'

export function Scrollable(props: ScrollableProps): React.JSX.Element {
    const {
        className,
        horizontal: horizontalOptional,
        ref: refOptional,
        vertical: verticalOptional,
        scrollingStyle,
        style,
        ...otherProps
    } = props
    const elementRef = useRef<HTMLElement>(null)
    const scrollBoth = isUndefined(horizontalOptional) && isUndefined(verticalOptional)
    const horizontal = horizontalOptional || scrollBoth
    const vertical = verticalOptional || scrollBoth
    const browserFeatures = useBrowserFeatures()
    const hasTouch = browserFeatures.touch

    const initOptions = useMemo(() => {
        // Forces updating the drag listeners when the browser capabilities change.
        return () => undefined
    }, [hasTouch])

    const {scrolling} = useScrollHorizontal(elementRef, {horizontal, vertical, initOptions})
    const refMerged = useMergeRefs(elementRef, refOptional)

    return (
        <Box
            {...otherProps}
            ref={refMerged}
            {...hasTouch ? {ref: undefined} : undefined}
            className={classes('Scrollable-ab5c', className, {scrolling})}
            style={{
                cursor: 'grab',
                overflowX: horizontal ? 'auto' : 'hidden',
                overflowY: vertical ? 'auto' : 'hidden',
                ...style,
                ...scrollingStyle?.(scrolling),
            }}
        />
    )
}

// Types ///////////////////////////////////////////////////////////////////////

export interface ScrollableProps extends BoxProps {
    horizontal?: undefined | boolean
    vertical?: undefined | boolean
    scrollingStyle?: undefined | ((scrolling: boolean) => undefined | React.CSSProperties)
}

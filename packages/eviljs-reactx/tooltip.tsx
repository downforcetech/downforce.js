import {classes} from '@eviljs/react/react.js'

import './tooltip.css'

export function Tooltip(props: TooltipProps) {
    const {children, className, content, contentClass, position, ...otherProps} = props

    if (! children) {
        return null
    }

    return (
        <div
            {...otherProps}
            className={classes('Tooltip-ccf9', className, position.split('-'))}
        >
            {children}

            <div className="root-21d5">
                <div className="tooltip-ac0e" role="tooltip">
                    <div className={classes('content-b6b3', contentClass)}>
                        {content}
                    </div>
                </div>
            </div>
        </div>
    )
}

// Types ///////////////////////////////////////////////////////////////////////

export interface TooltipProps extends React.HTMLAttributes<HTMLElement>, TooltipModel {
}

export interface TooltipModel {
    content: React.ReactNode
    contentClass?: undefined | string
    position: TooltipPosition
}

export type TooltipPosition = `${'top' | 'left' | 'right' | 'bottom'}-${'start' | 'center' | 'end'}`

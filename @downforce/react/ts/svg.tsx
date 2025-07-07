import {memo} from 'react'
import {classes} from './classes.js'
import type {ElementProps, Props, VoidProps} from './props.js'

export function defineSvg({name, ...initialProps}: SvgDefinitionProps): React.ComponentType<SvgProps> {
    function Svg(props: Props<SvgProps>) {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                data-name={name}
                {...initialProps}
                {...props}
                className={classes(initialProps.className, props.className)}
                style={{...initialProps.style, ...props.style}}
                children={initialProps.children}
            />
        )
    }

    Svg.displayName = name ?? Svg.name

    return memo(Svg)
}

// Types ///////////////////////////////////////////////////////////////////////

export interface SvgDefinitionProps extends ElementProps<'svg'> {
    name?: undefined | string
}

export interface SvgProps extends VoidProps<ElementProps<'svg'>> {
}

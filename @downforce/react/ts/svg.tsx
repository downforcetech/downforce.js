import {classes} from './classes.js'
import type {ElementProps, Props, VoidProps} from './props.js'

export function defineSvg(definitionProps: SvgDefinitionProps): React.ComponentType<SvgProps> {
    const {
        children,
        className: definitionClass,
        name,
        style: definitionStyle,
        viewBox,
        ...otherDefinitionProps
    } = definitionProps

    function Svg(props: Props<SvgProps>) {
        const {className, style, ...otherProps} = props

        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                viewBox={viewBox}
                data-name={name}
                {...otherDefinitionProps}
                {...otherProps}
                className={classes(definitionClass, className)}
                style={{...definitionStyle, ...style}}
            >
                {children}
            </svg>
        )
    }

    Svg.displayName = name

    return Svg
}

// Types ///////////////////////////////////////////////////////////////////////

export interface SvgDefinitionProps extends ElementProps<'svg'> {
    name?: undefined | string
    viewBox: string
}

export interface SvgProps extends VoidProps<ElementProps<'svg'>> {
}

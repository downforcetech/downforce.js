import {classes} from '@downforce/react/classes'
import type {ElementProps, Props} from '@downforce/react/props'
import {arrayWrap} from '@downforce/std/array'
import {Enum} from '@downforce/std/enum'
import type {ValueOf} from '@downforce/std/type'

export const SliderDirectionEnum: {
    Row: 'row'
    RowReverse: 'row-reverse'
    Column: 'column'
    ColumnReverse: 'column-reverse'
} = Enum({
    Row: 'row',
    RowReverse: 'row-reverse',
    Column: 'column',
    ColumnReverse: 'column-reverse',
})

export function Slider(props: Props<SliderProps>): React.JSX.Element {
    const {className, children, direction, selected, ...otherProps} = props
    const childrenList = arrayWrap(children)

    return (
        <div
            {...otherProps}
            className={classes('Slider-73e4 std-grid', className)}
        >
            {childrenList.map((it, idx) =>
                <Slide
                    key={idx}
                    className={classes('slide-1c54 std-grid-layer', {
                        previous: idx < selected,
                        selected: idx === selected,
                        following: idx > selected,
                    })}
                    style={computeSlideStyle({
                        index: idx,
                        selected,
                        direction: direction ?? SliderDirectionEnum.Row,
                    })}
                >
                    {it}
                </Slide>
            )}
        </div>
    )
}

export function Slide(props: Props<SlideProps>): React.JSX.Element {
    const {className, ...otherProps} = props

    return (
        <div
            {...otherProps}
            className={classes('Slide-0eab', className)}
        />
    )
}

export function computeSlideStyle(args: {
    index: number
    selected: number
    direction: SliderDirectionEnumType
}): React.CSSProperties {
    const {index, selected, direction} = args

    const [xDirection, yDirection] = (() => {
        switch (direction) {
            case SliderDirectionEnum.Column:
                return [0, 1]
            case SliderDirectionEnum.ColumnReverse:
                return [0, -1]
            case SliderDirectionEnum.Row:
                return [1, 0]
            case SliderDirectionEnum.RowReverse:
                return [-1, 0]
        }
    })()

    const distance = index - selected
    const x = `calc(${xDirection} * ${distance} * 100%)`
    const y = `calc(${yDirection} * ${distance} * 100%)`

    return {
        transform: `translate(${x}, ${y})`,
    }
}

// Types ///////////////////////////////////////////////////////////////////////

export interface SliderProps extends ElementProps<'div'> {
    children: Array<React.ReactNode>
    direction?: undefined | SliderDirectionEnumType
    selected: number
}

export interface SlideProps extends ElementProps<'div'> {
}

export type SliderDirectionEnumType = ValueOf<typeof SliderDirectionEnum>

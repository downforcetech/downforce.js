import {classes} from '@eviljs/react/classes'
import type {ElementProps, Props} from '@eviljs/react/props'
import {compute, type Computable} from '@eviljs/std/fn-compute'
import {useId} from 'react'

export function RadioGroup(props: Props<RadioGroupProps>): React.JSX.Element {
    const {className, items, selected, onChange, ...otherProps} = props
    const id = useId()

    return (
        <div
            {...otherProps}
            className={classes('RadioGroup-e37b', className)}
        >
            {items?.map((it, idx) => {
                const labelProps = compute(it.labelProps, it.value, idx)
                const inputProps = compute(it.inputProps, it.value, idx)
                const spanProps = compute(it.spanProps, it.value, idx)

                return (
                    <label
                        {...labelProps}
                        key={idx}
                        className={classes('item-bf74', labelProps?.className)}
                        data-selected={selected === it.value}
                    >
                        <input
                            {...inputProps}
                            className={classes('radio-1370', inputProps?.className)}
                            type="radio"
                            name={`radio-group-${id}-${idx}`}
                            value={it.value}
                            checked={selected === it.value}
                            // readOnly={true}
                            onChange={event => onChange?.(event.target.value, idx)}
                        />
                        <span
                            {...spanProps}
                            className={classes('label-b0ad', spanProps?.className)}
                        >
                            {it.label}
                        </span>
                    </label>
                )
            })}
        </div>
    )
}

// Types ///////////////////////////////////////////////////////////////////////

export interface RadioGroupProps extends Omit<ElementProps<'div'>, 'onChange'> {
    selected?: undefined | null | string
    items?: undefined | null | Array<{
        inputProps?: undefined | Computable<ElementProps<'input'>, [string, number]>
        label: React.ReactNode
        labelProps?: undefined | Computable<ElementProps<'label'>, [string, number]>
        value: string
        spanProps?: undefined | Computable<ElementProps<'span'>, [string, number]>
    }>
    onChange?: undefined | ((value: string, idx: number) => void)
}

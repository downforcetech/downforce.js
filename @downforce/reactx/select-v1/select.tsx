import {classes} from '@downforce/react/classes'
import type {Props, VoidProps} from '@downforce/react/props'
import type {Io} from '@downforce/std/fn-type'
import {isSome, isUndefined} from '@downforce/std/type-is'
import type {Prettify} from '@downforce/std/type-types'
import {useImperativeHandle} from 'react'
import {createPortal} from 'react-dom'
import type {SelectOptionGeneric, SelectPlacement} from './select.api.js'
import {
    SelectContext,
    useSelectManyProvider,
    useSelectOneProvider,
    type SelectContextValue,
    type SelectProviderOptions
} from './select.hook.js'

export * from './select.api.js'
export {SelectContext, useSelectManyContext, useSelectOneContext, type SelectContextValue} from './select.hook.js'


export function Select<V, S, O extends object = object>(props: Props<SelectProps<V, S, O>>): React.JSX.Element {
    const {className, context, ref, slots, teleport} = props

    useImperativeHandle(ref, () => context, [context])

    const renders = {
        control(props: SelectControlProps<V, S, O>) {
            if (slots.control) {
                return slots.control(props)
            }
            if (slots.Control) {
                return <slots.Control {...props}/>
            }
            return
        },
        option(props: SelectOptionProps<V, S, O>) {
            if (slots.option) {
                return slots.option(props)
            }
            if (slots.Option) {
                return <slots.Option {...props}/>
            }
            return
        },
        portal(props: SelectPortalProps<V, S, O>) {
            const {children} = props

            if (teleport === true) {
                return createPortal(children, document.body)
            }
            if (slots.portal) {
                return slots.portal(props)
            }
            if (slots.Portal) {
                return <slots.Portal {...props}/>
            }
            return children
        },
    }

    return (
        <SelectContext value={context}>
            <div
                {...context.props.rootProps}
                className={classes('Select-b791', className, context.props.rootProps.className)}
            >
                <div
                    {...context.props.controlProps}
                    className={classes('control-slot-cf42', context.props.controlProps.className)}
                >
                    {renders.control({
                        ...context,
                        onClick: context.props.controlProps.onClick,
                    })}
                </div>

                {(context.state.mounted || context.state.open) &&
                    renders.portal({
                        ...context,
                        children:
                            <div
                                {...context.props.optionsRootProps}
                                className={classes('options-root-831a', context.props.optionsRootProps.className)}
                            >
                                <div
                                    {...context.props.optionsListProps}
                                    className={classes('options-list-bfc5', context.props.optionsListProps.className)}
                                >
                                    {context.state.options?.map((option, optionIdx) => {
                                        const optionProps = context.props.optionPropsFor(option, optionIdx)

                                        return (
                                            <div
                                                {...optionProps}
                                                key={optionIdx}
                                                className={classes('option-slot-0fe7', optionProps.className)}
                                            >
                                                {renders.option({
                                                    ...context,
                                                    option: option,
                                                    optionIdx: optionIdx,
                                                    onClick: optionProps.onClick,
                                                })}
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ,
                    })
                }
            </div>
        </SelectContext>
    )
}

export function SelectOne<V, O extends object = object>(props: Props<SelectOneProps<V, O>>): React.JSX.Element {
    const {
        className,
        disabled,
        mounted,
        options,
        placement,
        readonly,
        ref,
        required,
        teleport,
        valid,

        initialOpen,
        open,
        onOpenChange,

        initialSelected,
        selected,
        onSelectedChange,

        controlProps,
        optionsRootProps,
        optionsListProps,
        optionProps,

        Control,
        Option,
        Portal,

        ControlComponent,
        OptionComponent,
        PortalComponent,
        ...rootProps
    } = props

    const context = useSelectOneProvider({
        disabled: disabled,
        initialOpen: initialOpen,
        initialSelected: initialSelected,
        mounted: mounted,
        open: open,
        options: options,
        placement: placement,
        readonly: readonly,
        required: required,
        selected: selected,
        onOpen: onOpenChange,
        onSelected: onSelectedChange,
        teleport: teleport,
        valid: valid,
        rootProps: rootProps,
        controlProps: controlProps,
        optionsRootProps: optionsRootProps,
        optionsListProps: optionsListProps,
        optionProps: optionProps,
    })

    const defaultRenders = {
        control(props: SelectControlProps<V, undefined | V, O>) {
            if (isUndefined(props.state.selected)) {
                return
            }
            const option = props.state.options?.find(it => it.value === props.state.selected)

            return option?.label ?? String(props.state.selected)
        },
        option(props: SelectOptionProps<V, undefined | V, O>) {
            return props.option.label ?? String(props.option.value)
        },
    }

    return (
        <Select
            ref={ref}
            className={classes('SelectOne-b79c', className)}
            context={context}
            slots={{
                control: Control ?? defaultRenders.control,
                option: Option ?? defaultRenders.option,
                portal: Portal,
                Control: ControlComponent,
                Option: OptionComponent,
                Portal: PortalComponent,
            }}
        />
    )
}

export function SelectMany<V, O extends object = object>(props: Props<SelectManyProps<V, O>>): React.JSX.Element {
    const {
        className,
        disabled,
        mounted,
        options,
        placement,
        readonly,
        ref,
        required,
        teleport,
        valid,

        initialOpen,
        open,
        onOpenChange,

        initialSelected,
        selected,
        onSelectedChange,

        controlProps,
        optionsRootProps,
        optionsListProps,
        optionProps,

        Control,
        Option,
        Portal,

        ControlComponent,
        OptionComponent,
        PortalComponent,
        ...rootProps
    } = props

    const context = useSelectManyProvider({
        disabled: disabled,
        initialOpen: initialOpen,
        initialSelected: initialSelected,
        mounted: mounted,
        open: open,
        options: options,
        placement: placement,
        readonly: readonly,
        required: required,
        selected: selected,
        onOpen: onOpenChange,
        onSelected: onSelectedChange,
        teleport: teleport,
        valid: valid,
        rootProps: rootProps,
        controlProps: controlProps,
        optionsRootProps: optionsRootProps,
        optionsListProps: optionsListProps,
        optionProps: optionProps,
    })

    const defaultRenders = {
        control(props: SelectControlProps<V, Array<V>, O>) {
            if (isUndefined(props.state.selected)) {
                return
            }
            // We map over the selected state to preserve the selection ordering.
            const selectedOptions = props.state.selected.map(value => props.state.options?.find(it => it.value === value)).filter(isSome)

            return selectedOptions.map(it => it.label ?? String(it?.value))
        },
        option(props: SelectOptionProps<V, Array<V>, O>) {
            return props.option.label ?? String(props.option.value)
        },
    }

    return (
        <Select
            ref={ref}
            className={classes('SelectMany-4d4c', className)}
            context={context}
            slots={{
                control: Control ?? defaultRenders.control,
                option: Option ?? defaultRenders.option,
                portal: Portal,
                Control: ControlComponent,
                Option: OptionComponent,
                Portal: PortalComponent,
            }}
        />
    )
}

// Types ///////////////////////////////////////////////////////////////////////

export interface SelectGenericProps<V, S, O extends object = object> extends
    Prettify<
        & Omit<VoidProps<React.JSX.IntrinsicElements['div']>, 'ref'>
        & React.RefAttributes<SelectContextValue<V, S, O>>
    >
{
    disabled?: undefined | boolean
    mounted?: undefined | boolean
    options: undefined | Array<SelectOptionGeneric<V> & O>
    placement?: undefined | SelectPlacement
    readonly?: undefined | boolean
    required?: undefined | boolean
    teleport?: undefined | boolean
    valid?: undefined | boolean

    initialOpen?: undefined | boolean
    open?: undefined | boolean
    onOpenChange?: undefined | ((value: boolean) => void)
    onSelectedChange(value: S, options: Array<O>): void

    controlProps?: undefined | SelectProviderOptions<V, S, O>['controlProps']
    optionsRootProps?: undefined | SelectProviderOptions<V, S, O>['optionsRootProps']
    optionsListProps?: undefined | SelectProviderOptions<V, S, O>['optionsListProps']
    optionProps?: undefined | SelectProviderOptions<V, S, O>['optionProps']

    Control?: undefined | Io<SelectControlProps<V, S, O>, React.ReactNode>
    Option?: undefined | Io<SelectOptionProps<V, S, O>, React.ReactNode>
    Portal?: undefined | Io<SelectPortalProps<V, S, O>, React.ReactNode>

    ControlComponent?: undefined | React.ComponentType<SelectControlProps<V, S, O>>
    OptionComponent?: undefined | React.ComponentType<SelectOptionProps<V, S, O>>
    PortalComponent?: undefined | React.ComponentType<SelectPortalProps<V, S, O>>
}

export interface SelectProps<V, S, O extends object = object> extends React.RefAttributes<SelectContextValue<V, S, O>> {
    className?: undefined | string
    context: SelectContextValue<V, S, O>
    slots: {
        control?: SelectGenericProps<V, S, O>['Control']
        option?: SelectGenericProps<V, S, O>['Option']
        portal?: SelectGenericProps<V, S, O>['Portal']
        Control?: SelectGenericProps<V, S, O>['ControlComponent']
        Option?: SelectGenericProps<V, S, O>['OptionComponent']
        Portal?: SelectGenericProps<V, S, O>['PortalComponent']
    }
    teleport?: undefined | boolean
}

export interface SelectOneProps<V, O extends object = object> extends SelectGenericProps<V, undefined | V, O> {
    initialSelected?: undefined | V
    selected?: undefined | V
}

export interface SelectManyProps<V, O extends object = object> extends SelectGenericProps<V, Array<V>, O> {
    initialSelected?: undefined | Array<V>
    selected?: Array<V>
}

export interface SelectControlProps<V, S, O extends object = object> extends SelectContextValue<V, S, O> {
    onClick(event: React.MouseEvent<HTMLElement>): void
}

export interface SelectOptionProps<V, S, O extends object = object> extends SelectContextValue<V, S, O> {
    option: SelectOptionGeneric<V> & O
    optionIdx: number
    onClick(event: React.MouseEvent<HTMLElement>): void
}

export interface SelectPortalProps<V, S, O extends object = object> extends SelectContextValue<V, S, O> {
    children: React.ReactNode
}

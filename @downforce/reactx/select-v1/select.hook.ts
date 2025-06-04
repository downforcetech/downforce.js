import {defineContext} from '@downforce/react/ctx'
import {useClickOutside} from '@downforce/react/gesture'
import {setRef} from '@downforce/react/ref'
import {compute, type Computable} from '@downforce/std/fn'
import {clamp} from '@downforce/std/number'
import {isDefined, isUndefined, mapSome} from '@downforce/std/optional'
import {classes} from '@downforce/web/classes'
import {KeyboardKey} from '@downforce/web/keybinding'
import {useCallback, useContext, useEffect, useId, useLayoutEffect, useRef, useState, type AriaRole} from 'react'
import type {SelectOptionGeneric, SelectPlacement} from './select.api.js'

const NoItems: [] = []

export const SelectContext: React.Context<undefined | SelectContextDefaultValue> = (
    defineContext<SelectContextDefaultValue>('SelectContext')
)

export function useSelectOneContext<V, O extends object = object>(): undefined | SelectContextValue<V, undefined | V, O> {
    return useContext(SelectContext) as undefined | SelectContextValue<V, undefined | V, O>
}

export function useSelectManyContext<V, O extends object = object>(): undefined | SelectContextValue<V, Array<V>, O> {
    return useContext(SelectContext) as undefined | SelectContextValue<V, Array<V>, O>
}

export function useSelectOneProvider<V, O extends object = object>(
    args: SelectOneProviderOptions<V, O>,
): SelectContextValue<V, undefined | V, O> {
    const {
        initialOpen,
        initialSelected,
        open: openControlled,
        selected: selectedControlled,
        onOpen: setOpenControlled,
        onSelected: setSelectedControlled,
        ...otherArgs
    } = args
    const [openUncontrolled, setOpenUncontrolled] = useState<boolean>(initialOpen ?? openControlled ?? false)
    const [selectedUncontrolled, setSelectedUncontrolled] = useState<undefined | V>(initialSelected)

    const open = openControlled ?? openUncontrolled
    const selected = selectedControlled ?? selectedUncontrolled

    useLayoutEffect(() => {
        if (isDefined(selectedControlled)) {
            return
        }
        // If the `selectedControlled` changes from a value to undefined
        // from outside (without passing from the `setSelected()`)
        // we need to reset the `selectedUncontrolled` value too.
        // We can't set `selectedUncontrolled` to undefined; we must set/reset it
        // to `initialSelected`, otherwise the `initialSelected` value set during
        // component mount is discarded.
        setSelectedUncontrolled(initialSelected)
    }, [selectedControlled])

    const setOpen = useCallback((open: boolean) => {
        setOpenUncontrolled(open)
        setOpenControlled?.(open)
    }, [setOpenUncontrolled, setOpenControlled])

    const setSelected = useCallback((value: undefined | V) => {
        setSelectedUncontrolled(value)
        setSelectedControlled?.(value, args.options ?? [])
    }, [setSelectedUncontrolled, setSelectedControlled, args.options])

    const clearSelected = useCallback(() => {
        setSelected(undefined)
    }, [setSelected])

    const isSelected = useCallback((value: V) => {
        return selected === value
    }, [selected])

    const onOptionSelection = useCallback((option: SelectOptionGeneric<V> & O, optionIdx: number, event: React.UIEvent<HTMLElement>) => {
        setSelected(option.value)
        setOpen(false)
    }, [setSelected, setOpen])

    const context = useSelectProvider({
        ...otherArgs,
        open: open,
        selected: selected,
        setOpen: setOpen,
        setSelected: setSelected,
        clearSelected: clearSelected,
        isSelected: isSelected,
        onOptionSelection: onOptionSelection,
    })

    useLayoutEffect(() => {
        if (context.state.placement !== 'positioned') {
            return
        }
        if (context.state.teleport) {
            return
        }
        if (! context.state.options) {
            return
        }
        if (! context.state.open) {
            ElementTranslate.clean(context.refs.optionsRootRef.current)
            return
        }
        if (isUndefined(context.state.selected)) {
            ElementTranslate.clean(context.refs.optionsRootRef.current)
            return
        }

        const selected = context.state.selected
        const selectedOptionIdx = context.state.options.findIndex(it => it.value === selected)
        const controlElement = context.refs.controlRef.current
        const optionsRootElement = context.refs.optionsRootRef.current
        const optionsListElement = context.refs.optionsListRef.current
        const optionElement = context.refs.optionsRef.current[selectedOptionIdx]

        if (selectedOptionIdx < 0) {
            return
        }
        if (! controlElement) {
            return
        }
        if (! optionsRootElement) {
            return
        }
        if (! optionsListElement) {
            return
        }
        if (! optionElement) {
            return
        }

        const hasScrolling = (optionsListElement.scrollHeight - optionsListElement.clientHeight)

        if (hasScrolling) {
            const scrollHeight = optionsListElement.scrollHeight
            const optionsListElementRect = optionsListElement.getBoundingClientRect()
            const optionElementRect = optionElement.getBoundingClientRect()
            const optionElementOffsetY = optionElement.offsetTop

            const optionElementScrollY = (
                optionElementOffsetY
                - (optionsListElementRect.height / 2) // Centered inside the options list.
                + (optionElementRect.height / 2) // Centered inside the options list.
            )

            optionsListElement.scrollTop = clamp(0, optionElementScrollY, scrollHeight)
            return
        }

        const [currentXOptional, currentYOptional] = ElementTranslate.read(context.refs.optionsRootRef.current)
        const currentY = currentYOptional ?? 0

        const optionElementRect = optionElement.getBoundingClientRect()
        const controlElementRect = controlElement.getBoundingClientRect()

        const heightDelta = controlElementRect.height - optionElementRect.height
        const yDelta = controlElementRect.y - optionElementRect.y
        const transformY = currentY + yDelta + (heightDelta / 2)

        ElementTranslate.write(context.refs.optionsRootRef.current, 0, transformY)
    }, [context.state.placement, context.state.teleport, context.state.open, context.state.selected, context.state.options])

    return context
}

export function useSelectManyProvider<V, O extends object = object>(
    args: SelectManyProviderOptions<V, O>,
): SelectContextValue<V, Array<V>, O> {
    const {
        initialOpen,
        initialSelected,
        open: openControlled,
        selected: selectedControlled,
        onOpen: setOpenControlled,
        onSelected: setSelectedControlled,
        ...otherArgs
    } = args
    const [openUncontrolled, setOpenUncontrolled] = useState<boolean>(initialOpen ?? openControlled ?? false)
    const [selectedUncontrolled, setSelectedUncontrolled] = useState<Array<V>>(initialSelected ?? NoItems)

    const open = openControlled ?? openUncontrolled
    const selected = selectedControlled ?? selectedUncontrolled

    const setOpen = useCallback((value: boolean) => {
        setOpenUncontrolled(value)
        setOpenControlled?.(value)
    }, [setOpenUncontrolled, setOpenControlled])

    const setSelected = useCallback((value: Array<V>) => {
        setSelectedUncontrolled(value)
        setSelectedControlled?.(value, args.options ?? [])
    }, [setSelectedUncontrolled, setSelectedControlled, args.options])

    const clearSelected = useCallback(() => {
        setSelected(NoItems)
    }, [setSelected])

    const isSelected = useCallback((value: V) => {
        return selected.includes(value)
    }, [selected])

    const onOptionSelection = useCallback((option: SelectOptionGeneric<V> & O, optionIdx: number, event: React.UIEvent<HTMLElement>) => {
        const value: Array<V> = (
            selected.includes(option.value)
                ? selected.filter(it => it !== option.value)
                : [...selected, option.value]
        )
        setSelected(value)
    }, [selected, setSelected, setOpen])

    const context = useSelectProvider({
        ...otherArgs,
        open: open,
        selected: selected,
        setOpen: setOpen,
        setSelected: setSelected,
        clearSelected: clearSelected,
        isSelected: isSelected,
        onOptionSelection: onOptionSelection,
    })

    useLayoutEffect(() => {
        if (context.state.placement !== 'positioned') {
            return
        }
        if (context.state.teleport) {
            return
        }
        if (! context.state.options) {
            return
        }
        if (! context.state.open) {
            ElementTranslate.clean(context.refs.optionsRootRef.current)
            return
        }
        if (! context.state.selected) {
            ElementTranslate.clean(context.refs.optionsRootRef.current)
            return
        }
        if (context.state.selected.length === 0) {
            ElementTranslate.clean(context.refs.optionsRootRef.current)
            return
        }
        // TODO: implement positioned placement for multi select.
    }, [context.state.placement, context.state.teleport, context.state.open, context.state.selected, args.options])

    return context
}

export function useSelectProvider<V, S, O extends object = object>(
    args: SelectProviderOptions<V, S, O>,
): SelectContextValue<V, S, O> {
    const [PRIVATE_optionFocused, PRIVATE_setOptionFocused] = useState<number>()
    const [PRIVATE_optionTabbed, PRIVATE_setOptionTabbed] = useState<number>()

    const refs = {
        rootRef: useRef<HTMLElement>(undefined),
        controlRef: useRef<HTMLElement>(undefined),
        optionsRootRef: useRef<HTMLElement>(undefined),
        optionsListRef: useRef<HTMLElement>(undefined),
        optionsRef: useRef<Array<undefined | HTMLElement>>(NoItems),
    }

    const statePartial = {
        clearSelected: args.clearSelected,
        disabled: args.disabled ?? false,
        mounted: args.mounted ?? false,
        open: args.open,
        optionFocused: PRIVATE_optionFocused,
        options: args.options,
        optionTabbed: PRIVATE_optionTabbed,
        placement: args.placement ?? 'center',
        readonly: args.readonly ?? false,
        required: args.required ?? false,
        selected: args.selected,
        setOptionFocused: PRIVATE_setOptionFocused,
        setOptionTabbed: PRIVATE_setOptionTabbed,
        teleport: args.teleport ?? false,
        valid: args.valid ?? true,
    } satisfies Partial<SelectContextValue<V, S, O>['state']>

    const state: SelectContextValue<V, S, O>['state'] = {
        ...statePartial,

        isSelected: args.isSelected,

        setOpen: useCallback((open: boolean) => {
            if (state.disabled) {
                return
            }
            /*
            * // Readonly select can be opened.
            * if (state.readonly) {
            *   return
            * }
            */

            args.setOpen(open)
        }, [args.setOpen, statePartial.disabled, statePartial.readonly]),

        setSelected: useCallback((value: S) => {
            if (state.disabled) {
                return
            }
            if (state.readonly) {
                return
            }

            args.setSelected(value)
        }, [args.setSelected, statePartial.disabled, statePartial.readonly]),
    }

    const onOptionSelection = useCallback((option: SelectOptionGeneric<V> & O, optionIdx: number, event: React.UIEvent<HTMLElement>) => {
        if (state.disabled) {
            return
        }
        if (state.readonly) {
            return
        }
        if (option.disabled) {
            return
        }

        args.onOptionSelection(option, optionIdx, event)
    }, [args.onOptionSelection, state.disabled, state.readonly])

    const computedPropsContext: SelectProviderFragments<V, S, O>['PropsContext'] = {
        ...statePartial,
    }
    const computedProps = {
        rootProps: compute(args.rootProps, computedPropsContext),
        controlProps: compute(args.controlProps, computedPropsContext),
        optionsRootProps: compute(args.optionsRootProps, computedPropsContext),
        optionsListProps: compute(args.optionsListProps, computedPropsContext),
        optionProps: compute(args.optionProps, computedPropsContext),
    }
    const ids = {
        optionsRootId: useId(),
    }

    const props: SelectContextValue<V, S, O>['props'] = {
        rootProps: {
            ...computedProps.rootProps,
            ref: useCallback((element: null | HTMLElement) => {
                refs.rootRef.current = element ?? undefined
                mapSome(computedProps.rootProps?.ref, ref => setRef<null | HTMLElement>(ref, element))
            }, [computedProps.rootProps?.ref]),
            className: classes(computedProps.rootProps?.className),
            ['aria-controls']: ids.optionsRootId,
            ['aria-disabled']: state.disabled,
            ['aria-expanded']: state.open,
            ['data-placement']: state.placement,
            style: {
                ...SelectPlacementPositionedKit.rootPropsStyles(state),
                ...computedProps.rootProps?.style,
            },
            onBlur: useCallback((event: React.FocusEvent<HTMLElement>) => {
                if (state.disabled) {
                    return
                }
                /*
                * // Readonly select can be closed.
                * if (state.readonly) {
                *   return
                * }
                */
                if (refs.rootRef.current?.contains(event.relatedTarget)) {
                    // Focus is inside the options list.
                    return
                }

                computedProps.rootProps?.onBlur?.(event)

                // User is tabbing out of the select.
                state.setOpen(false)
            }, [state.disabled, state.readonly, state.setOpen, computedProps.rootProps?.onBlur]),
        },

        controlProps: {
            ...computedProps.controlProps,
            ref: useCallback((element: null | HTMLElement) => {
                refs.controlRef.current = element ?? undefined
                mapSome(computedProps.controlProps?.ref, ref => setRef<null | HTMLElement>(ref, element))
            }, [computedProps.controlProps?.ref]),
            className: classes(computedProps.controlProps?.className),
            role: 'combobox',
            ['aria-invalid']: ! state.valid,
            ['aria-readonly']: state.readonly,
            ['aria-required']: state.required,
            tabIndex: state.disabled ? -1 : 0,
            onClick: useCallback((event: React.MouseEvent<HTMLElement>) => {
                if (state.disabled) {
                    return
                }
                /*
                * // Readonly select can be opened.
                * if (state.readonly) {
                *   return
                * }
                */
                /*
                * // Click target is never the control element, but always an element inside it.
                * if (event.target !== event.currentTarget) {
                *     return
                * }
                */

                computedProps.controlProps?.onClick?.(event)

                state.setOpen(! state.open)

                // On click we should reset focused/tabbed option.
                state.setOptionFocused(undefined)
                state.setOptionTabbed(undefined)
            }, [state.disabled, state.readonly, state.open, state.setOptionFocused, state.setOptionTabbed, computedProps.controlProps?.onClick]),
            onFocus: useCallback((event: React.FocusEvent<HTMLElement>) => {
                if (state.disabled) {
                    return
                }
                if (state.readonly) {
                    return
                }
                if (event.target !== event.currentTarget) {
                    return
                }

                computedProps.controlProps?.onFocus?.(event)

                state.setOptionFocused(undefined)
            }, [state.disabled, state.readonly, state.setOptionFocused, computedProps.controlProps?.onFocus]),
            onKeyDown: useCallback((event: React.KeyboardEvent<HTMLElement>) => {
                if (state.disabled) {
                    return
                }
                /*
                * // Readonly select can be opened.
                * if (state.readonly) {
                *   return
                * }
                */
                if (event.target !== event.currentTarget) {
                    return
                }

                computedProps.controlProps?.onKeyDown?.(event)

                switch (event.key) {
                    case KeyboardKey.ArrowDown: {
                        event.preventDefault()
                        event.stopPropagation()

                        state.setOpen(true)
                        state.setOptionFocused(state.optionTabbed ?? 0) // We move focus to last tabbed/focused option.
                        state.setOptionTabbed(state.optionTabbed ?? 0)
                    } break
                    case KeyboardKey.Enter:
                    case KeyboardKey.Space:
                        event.preventDefault()
                        event.stopPropagation()

                        state.setOpen(! state.open)
                    break
                    case KeyboardKey.Escape:
                        event.preventDefault()
                        event.stopPropagation()

                        state.setOpen(false)
                    break
                }
            }, [
                state.disabled,
                state.readonly,
                state.open,
                state.optionTabbed,
                state.setOpen,
                state.setOptionFocused,
                state.setOptionTabbed,
                computedProps.controlProps?.onKeyDown,
            ]),
        },

        optionsRootProps: {
            ...computedProps.optionsRootProps,
            className: classes(computedProps.optionsRootProps?.className),
            ref: useCallback((element: null | HTMLElement) => {
                refs.optionsRootRef.current = element ?? undefined
                mapSome(computedProps.optionsRootProps?.ref, ref => setRef<null | HTMLElement>(ref, element))
            }, [computedProps.optionsRootProps?.ref]),
            ['aria-hidden']: ! state.open,
            style: {
                ...SelectPlacementPositionedKit.optionsRootPropsStyles(state),
                ...computedProps.optionsRootProps?.style,
            },
        },

        optionsListProps: {
            ...computedProps.optionsListProps,
            className: classes(computedProps.optionsListProps?.className),
            ref: useCallback((element: null | HTMLElement) => {
                refs.optionsListRef.current = element ?? undefined
                mapSome(computedProps.optionsListProps?.ref, ref => setRef<null | HTMLElement>(ref, element))
            }, [computedProps.optionsListProps?.ref]),
            role: 'listbox',
        },

        optionPropsFor: (option: SelectOptionGeneric<V> & O, optionIdx: number) => ({
            ...computedProps.optionProps,
            ref(element: null | HTMLElement) {
                refs.optionsRef.current[optionIdx] = element ?? undefined
                mapSome(computedProps.optionProps?.ref, ref => setRef<null | HTMLElement>(ref, element))
            },
            className: classes(),
            role: 'option',
            ['aria-disabled']: option.disabled ?? false,
            ['aria-selected']: state.isSelected(option.value),
            tabIndex: optionIdx === state.optionTabbed ? 0 : -1,
            onClick(event: React.MouseEvent<HTMLElement>) {
                if (state.disabled) {
                    return
                }
                if (state.readonly) {
                    return
                }
                if (option.disabled) {
                    return
                }

                computedProps.optionProps?.onClick?.(event)
                onOptionSelection(option, optionIdx, event)
            },
            onKeyDown(event: React.KeyboardEvent<HTMLElement>) {
                if (state.disabled) {
                    return
                }
                /*
                * // Readonly select can be navigated and closed.
                * if (state.readonly) {
                *   return
                * }
                */

                computedProps.optionProps?.onKeyDown?.(event)

                switch (event.key) {
                    case KeyboardKey.ArrowUp: {
                        event.preventDefault()

                        const prevOptionIdx = optionIdx - 1
                        const prevOptionElement = refs.optionsRef.current[prevOptionIdx]

                        if (! prevOptionElement) {
                            return
                        }

                        state.setOptionFocused(prevOptionIdx)
                        state.setOptionTabbed(prevOptionIdx)
                    } break
                    case KeyboardKey.ArrowDown: {
                        event.preventDefault()

                        const optionIdx = refs.optionsRef.current.indexOf(event.currentTarget)

                        if (optionIdx === -1) {
                            return
                        }

                        const nextOptionIdx = optionIdx + 1
                        const nextOptionElement = refs.optionsRef.current[nextOptionIdx]

                        if (! nextOptionElement) {
                            return
                        }

                        state.setOptionFocused(nextOptionIdx)
                        state.setOptionTabbed(nextOptionIdx)
                    } break
                    case KeyboardKey.Enter:
                    case KeyboardKey.Space: {
                        event.preventDefault()

                        if (state.readonly) {
                            return
                        }
                        if (option.disabled) {
                            return
                        }

                        onOptionSelection(option, optionIdx, event)
                    } break
                    case KeyboardKey.Escape:
                        event.preventDefault()
                        event.stopPropagation()

                        state.setOpen(false)

                        refs.controlRef.current?.focus() // We move back the focus to the control element.
                    break
                }
            },
        }),
    }

    useClickOutside(
        refs.rootRef,
        useCallback(event => {
            if (event.target && ! document.documentElement.contains(event.target as Node)) {
                // A DOM Node has been removed from the DOM tree by React.
                // Not an actual click outside event.
                return
            }

            state.setOpen(false)
            // We reset focused and tabbed option when clicking outside.
            state.setOptionFocused(undefined)
            state.setOptionTabbed(undefined)
        }, [state.setOpen, state.setOptionFocused, state.setOptionTabbed]),
        {active: state.open},
    )

    useEffect(() => {
        if (state.open) {
            // On open we focus last tabbed element.
            state.setOptionFocused(state.optionTabbed)
        }
        else {
            // On close we reset the focused element.
            state.setOptionFocused(undefined)
        }
    }, [state.open, state.setOptionFocused])

    useEffect(() => {
        if (isUndefined(state.optionFocused)) {
            return
        }

        refs.optionsRef.current[state.optionFocused]?.focus()
    }, [state.optionFocused])

    useEffect(() => {
        refs.optionsRef.current = refs.optionsRef.current.slice(0, args.options?.length ?? 0)
    }, [args.options?.length])

    return {props, refs, state}
}

const ElementTranslate = {
    read(element: undefined | null | HTMLElement): Array<number> {
        return element?.style.translate
            .split(' ')
            .filter(Boolean)
            .map(it => it.replace('px', ''))
            .map(Number)
            ?? []
    },
    write(element: undefined | null | HTMLElement, xPx: number, yPx: number) {
        if (! element) {
            return
        }
        element.style.translate = `${xPx}px ${yPx}px`
    },
    clean(element: undefined | null | HTMLElement) {
        if (! element) {
            return
        }

        element.style.translate = ''
    },
}

export const SelectPlacementPositionedKit = {
    rootPropsStyles(state: SelectContextDefaultValue['state']): undefined | React.CSSProperties {
        if (state.teleport) {
            return
        }
        if (state.open) {
            return {
                position: 'relative',
                zIndex: 'var(--Select-root-zindex, var(--Select-root-zindex--default, 1))',
            }
        }
        if (state.mounted) {
            return {
                position: 'relative',
            }
        }
        return
    },
    optionsRootPropsStyles(state: SelectContextDefaultValue['state']): undefined | React.CSSProperties {
        if (state.teleport) {
            return
        }
        if (! state.open) {
            return {
                display: 'var(--Select-options-display--hidden, var(--Select-options-display--hidden--default, none))',
            }
        }

        switch (state.placement) {
            case 'top': return {
                position: 'var(--Select-options-position, var(--Select-options-position--default, absolute))' as React.CSSProperties['position'],
                zIndex: 'var(--Select-options-zindex, var(--Select-options-zindex--default, 1))',
                top: 'calc(-1 * var(--Select-options-gap, var(--Select-options-gap--default, 0px)))',
                left: 0,
                right: 0,
                width: '100%',
                height: 0,
                margin: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-end',
            }
            case 'center': return {
                position: 'var(--Select-options-position, var(--Select-options-position--default, absolute))' as React.CSSProperties['position'],
                zIndex: 'var(--Select-options-zindex, var(--Select-options-zindex--default, 1))',
                inset: 0,
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }
            case 'bottom': return {
                position: 'var(--Select-options-position, var(--Select-options-position--default, absolute))' as React.CSSProperties['position'],
                zIndex: 'var(--Select-options-zindex, var(--Select-options-zindex--default, 1))',
                left: 0,
                right: 0,
                bottom: 'calc(-1 * var(--Select-options-gap, var(--Select-options-gap--default, 0px)))',
                width: '100%',
                height: 0,
                margin: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'flex-start',
            }
            case 'positioned': return {
                position: 'var(--Select-options-position, var(--Select-options-position--default, absolute))' as React.CSSProperties['position'],
                zIndex: 'var(--Select-options-zindex, var(--Select-options-zindex--default, 1))',
                inset: 0,
                width: '100%',
                height: '100%',
                margin: 'auto',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }
        }
    },
}

// Types ///////////////////////////////////////////////////////////////////////

export type SelectContextDefaultValue = SelectContextValue<any, any, object>

export interface SelectContextValue<V, S, O extends object = object> {
    props: {
        rootProps: React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement> & {
            ref: React.RefCallback<null | HTMLElement>
            className: undefined | string
            'aria-controls': string
            'aria-disabled': boolean
            'aria-expanded': boolean
            'data-placement': string
            style: React.CSSProperties
            onBlur(event: React.FocusEvent<HTMLElement>): void
        }
        controlProps: React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement> & {
            ref: React.RefCallback<null | HTMLElement>
            className: undefined | string
            role: AriaRole
            'aria-invalid': boolean
            'aria-readonly': boolean
            'aria-required': boolean
            tabIndex: number
            onClick(event: React.MouseEvent<HTMLElement>): void
            onFocus(event: React.FocusEvent<HTMLElement>): void
            onKeyDown(event: React.KeyboardEvent<HTMLElement>): void
        }
        optionsRootProps: React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement> & {
            ref: React.RefCallback<null | HTMLElement>
            className: undefined | string
            'aria-hidden': boolean
            style: React.CSSProperties
        }
        optionsListProps: React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement> & {
            ref: React.RefCallback<null | HTMLElement>
            className: undefined | string
            role: AriaRole
        }
        optionPropsFor(option: SelectOptionGeneric<V> & O, optionIdx: number): React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement> & {
            ref(element: null | HTMLElement): void
            className: undefined | string
            role: AriaRole
            'aria-disabled': boolean
            'aria-selected': boolean
            tabIndex: number
            onClick(event: React.MouseEvent<HTMLElement>): void
            onKeyDown(event: React.KeyboardEvent<HTMLElement>): void
        }
    }
    refs: {
        rootRef: React.RefObject<undefined | HTMLElement>
        controlRef: React.RefObject<undefined | HTMLElement>
        optionsRootRef: React.RefObject<undefined | HTMLElement>
        optionsListRef: React.RefObject<undefined | HTMLElement>
        optionsRef: React.RefObject<Array<undefined | HTMLElement>>
    }
    state: {
        disabled: boolean
        mounted: boolean
        open: boolean
        optionFocused: undefined | number
        options: undefined | Array<SelectOptionGeneric<V> & O>
        optionTabbed: undefined | number
        placement: SelectPlacement
        readonly: boolean
        required: boolean
        selected: S
        teleport: boolean
        valid: boolean
        clearSelected(): void
        isSelected(value: V): boolean
        setOpen(open: boolean): void
        setOptionFocused(optionIdx: undefined | number): void
        setOptionTabbed(optionIdx: undefined | number): void
        setSelected(value: S): void
    }
}

export interface SelectProviderFragments<V, S, O extends object = object> {
    Props: {
        rootProps: undefined | Computable<undefined | (React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>), [SelectProviderFragments<V, S, O>['PropsContext']]>
        controlProps: undefined | Computable<undefined | (React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>), [SelectProviderFragments<V, S, O>['PropsContext']]>
        optionsRootProps: undefined | Computable<undefined | (React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>), [SelectProviderFragments<V, S, O>['PropsContext']]>
        optionsListProps: undefined | Computable<undefined | (React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>), [SelectProviderFragments<V, S, O>['PropsContext']]>
        optionProps: undefined | Computable<undefined | (React.HTMLAttributes<HTMLElement> & React.RefAttributes<HTMLElement>), [SelectProviderFragments<V, S, O>['PropsContext']]>
    }
    State: {
        disabled: undefined | boolean
        mounted: undefined | boolean
        open: boolean
        options: undefined | Array<SelectOptionGeneric<V> & O>
        placement: undefined | SelectPlacement
        readonly: undefined | boolean
        required: undefined | boolean
        selected: S
        teleport: undefined | boolean
        valid: undefined | boolean
    }
    StateActions: {
        clearSelected(): void
        isSelected(value: V): boolean
        onOptionSelection(option: SelectOptionGeneric<V> & O, optionIdx: number, event: React.UIEvent<HTMLElement>): void
        setOpen(open: boolean): void
        setSelected(value: S): void
    }
    PropsContext: SelectProviderFragments<V, S, O>['State']
}

export type SelectProviderOptions<V, S, O extends object = object> =
    & SelectProviderFragments<V, S, O>['Props']
    & SelectProviderFragments<V, S, O>['State']
    & SelectProviderFragments<V, S, O>['StateActions']

export type SelectCommonProviderOptions<V, S, O extends object = object> =
    & SelectProviderFragments<V, S, O>['Props']
    & Omit<SelectProviderFragments<V, S, O>['State'], 'open' | 'selected'>
    & {
    initialOpen: undefined | SelectProviderOptions<V, S, O>['open']
    open: undefined | SelectProviderOptions<V, S, O>['open']
    onOpen: undefined | SelectProviderOptions<V, S, O>['setOpen']
    onSelected(value: S, options: Array<SelectOptionGeneric<V> & O>): void
}

export interface SelectOneProviderOptions<V, O extends object = object> extends SelectCommonProviderOptions<V, undefined | V, O> {
    initialSelected: undefined | SelectProviderOptions<V, undefined | V, O>['selected']
    selected: undefined | SelectProviderOptions<V, undefined | V, O>['selected']
}

export interface SelectManyProviderOptions<V, O extends object = object> extends SelectCommonProviderOptions<V, Array<V>, O> {
    initialSelected: undefined | SelectProviderOptions<V, Array<V>, O>['selected']
    selected: undefined | SelectProviderOptions<V, Array<V>, O>['selected']
}

import {call, compute, type Computable} from '@downforce/std/fn'
import {areObjectsEqualShallow, omitObjectProps} from '@downforce/std/object'
import {isUndefined} from '@downforce/std/optional'
import type {Void} from '@downforce/std/type'
import {areEqualDeepStrict} from '@downforce/std/value'
import {memo, startTransition, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState} from 'react'
import {classes} from './classes.js'
import {useCallbackThrottled} from './defer.js'
import {useEvent} from './event.js'
import {ListVirtualSdk as Sdk, type ListVirtualModule} from './list/api.js'
import type {ElementProps, Props, VoidProps} from './props.js'
import {useResizeObserver} from './resize-observer.js'

export function ListVirtual<I>(props: Props<ListVirtualProps<I>>): React.JSX.Element {
    const {
        children,
        className,
        debugRender,
        direction: directionOptional,
        grid: gridOptional,
        itemKeyOf: itemKeyOfOptional,
        items,
        itemSize,
        offscreen: offscreenOptional,
        onLayoutChange,
        onRenderChange,
        ref: refOptional,
        resizeThrottleDelay: resizeThrottleDelayOptional,
        scrollThrottleDelay: scrollThrottleDelayOptional,
        style,
        updatePriority: updatePriorityOptional,
        ...otherProps
    } = props

    const directionComputable = directionOptional ?? Sdk.enums.DirectionEnum.Vertical
    const gridComputable = gridOptional ?? 1
    const offscreenComputable = offscreenOptional ?? Sdk.defaults.offscreen
    const resizeThrottleDelay = resizeThrottleDelayOptional ?? Sdk.defaults.resizeThrottleDelay
    const scrollThrottleDelay = scrollThrottleDelayOptional ?? Sdk.defaults.scrollThrottleDelay
    const updatePriority = updatePriorityOptional ?? Sdk.defaults.updatePriority
    const itemKeyOf = itemKeyOfOptional ?? (Sdk.computeItemKeyOf as (item: I, idx: number) => number | string)

    const [context, setContext] = useState<undefined | ListVirtualModule.Context>()
    const [scrollPositionKey, setScrollPositionKey] = useState(0)
    const contextRef = useRef(context)
    const windowRef = useRef<Window>(window)
    const containerRef = useRef<HTMLDivElement>(null)
    const scrollerRef = useRef<HTMLDivElement>(null)

    const direction = context ? compute(directionComputable, context) : undefined
    const grid = context ? Math.max(0, compute(gridComputable, context)) : undefined
    const offscreen = context ? Math.max(1, compute(offscreenComputable, context)) : undefined

    const updateContext = useCallback((): undefined => {
        const containerElement = containerRef.current
        const scrollerElement = scrollerRef.current

        if (! containerElement) {
            return
        }
        if (! scrollerElement) {
            return
        }

        const newContext = Sdk.computeContext({containerElement, scrollerElement})

        if (areEqualDeepStrict(contextRef.current, newContext)) {
            return
        }

        contextRef.current = newContext

        Sdk.matchUpdatePriority(updatePriority, {
            high() {
                setContext(newContext)
            },
            low() {
                startTransition(() => {
                    setContext(newContext)
                })
            },
        })
    }, [updatePriority])

    const updateScroll = useCallback((): undefined => {
        const context = contextRef.current

        if (! context) {
            return
        }
        if (! direction) {
            return
        }

        const newScrollPositionKey = Sdk.matchDirection(direction, {
            horizontal() {
                return Sdk.computeVirtualLayoutKeyOf({
                    containerDimension: context.containerClient.width,
                    position: scrollerRef.current?.scrollLeft ?? 0,
                })
            },
            vertical() {
                return Sdk.computeVirtualLayoutKeyOf({
                    containerDimension: context.containerClient.height,
                    position: scrollerRef.current?.scrollTop ?? 0,
                })
            },
        })

        Sdk.matchUpdatePriority(updatePriority, {
            high() {
                setScrollPositionKey(newScrollPositionKey)
            },
            low() {
                startTransition(() => {
                    setScrollPositionKey(newScrollPositionKey)
                })
            },
        })
    }, [direction, updatePriority])

    const updateContextAndScroll = useCallback(() => {
        updateContext()
        updateScroll()
    }, [updateContext, updateScroll])

    const onResizeThrottled = useCallbackThrottled(resizeThrottleDelay, updateContextAndScroll)
    const onScrollThrottled = useCallbackThrottled(scrollThrottleDelay, updateScroll)

    // We use useEffect instead of useLayoutEffect here, because with useLayoutEffect
    // we would force browser to trash the layout with consequent loooooong task:
    // Style + Layout + Paint + Composite.
    useEffect(updateContext, [updateContext])
    useResizeObserver(containerRef, onResizeThrottled)
    useEvent(windowRef, 'resize', onResizeThrottled, undefined, {passive: true})

    const virtualLayout = useMemo(() => {
        if (! context) {
            return
        }
        if (! direction) {
            return
        }
        if (isUndefined(grid)) {
            return
        }
        if (isUndefined(offscreen)) {
            return
        }

        return Sdk.computeVirtualLayout({
            context: context,
            direction: direction,
            grid: grid,
            itemKeyOf: itemKeyOf,
            items: items,
            itemSize: itemSize,
            offscreen: offscreen,
        })
    }, [context, direction, grid, items, itemSize, offscreen/*, itemKeyOf*/])

    const renderState = useMemo(() => {
        if (! virtualLayout) {
            return
        }

        return Sdk.computeRenderState({
            offscreen: virtualLayout.offscreen,
            scrollPositionKey: scrollPositionKey,
            virtualLayoutMap: virtualLayout.virtualLayoutMap,
        })
    }, [scrollPositionKey, virtualLayout])

    useImperativeHandle<ListVirtualRefValue<I>, ListVirtualRefValue<I>>(refOptional, () => ({
        containerRef: containerRef,
        scrollerRef: scrollerRef,
        virtualLayout: virtualLayout,
    }), [virtualLayout])

    useEffect(() => {
        onLayoutChange?.(virtualLayout)
    }, [virtualLayout])

    useEffect(() => {
        onRenderChange?.(renderState)
    }, [renderState])

    debugRender?.({renderState: renderState, virtualLayout: virtualLayout})

    return (
        <div
            {...otherProps}
            ref={containerRef}
            className={classes('ListVirtual-2616fa', className)}
            style={{
                ...style,
                ...Sdk.styleOfContainer(direction),
            }}
        >
            <div
                ref={scrollerRef}
                className='scroller-26b929'
                style={Sdk.styleOfScroller(direction, virtualLayout?.virtualSize)}
                onScrollCapture={onScrollThrottled}
            >
                {context && renderState?.map(it => (
                    <div
                        key={it.key}
                        className='v-item-2602e3'
                        style={Sdk.styleOfItem(it, direction)}
                    >
                        {children(it.item, it.idx, it, context)}
                    </div>
                ))}
            </div>
        </div>
    )
}

export const ListVirtualMemo = memo(ListVirtual, arePropsEqual) as <I>(props: Props<ListVirtualProps<I>>) => React.JSX.Element

function arePropsEqual(
    prevProps: ListVirtualProps<unknown>,
    nextProps: ListVirtualProps<unknown>,
): boolean {
    const tests: Array<() => boolean> = [
        () => areObjectsEqualShallow(
            omitObjectProps(prevProps, ['debugRender', 'itemKeyOf', 'onLayoutChange', 'onRenderChange']),
            omitObjectProps(nextProps, ['debugRender', 'itemKeyOf', 'onLayoutChange', 'onRenderChange']),
        ),
    ]

    return tests.every(call)
}

// Types ///////////////////////////////////////////////////////////////////////

export interface ListVirtualProps<I> extends
    Omit<VoidProps<ElementProps<'div'>>, 'ref'>,
    React.RefAttributes<ListVirtualRefValue<I>>
{
    debugRender?: undefined | ((args: {
        renderState: undefined | ListVirtualModule.LayoutList<I>
        virtualLayout: undefined | ListVirtualModule.Layout<I>
    }) => Void)
    children(item: I, idx: number, itemLayout: ListVirtualModule.LayoutItem<I>, context: ListVirtualModule.Context): React.ReactElement
    direction?: undefined | Computable<ListVirtualModule.DirectionEnum, [context: ListVirtualModule.Context]>
    grid?: undefined | Computable<number, [context: ListVirtualModule.Context]>
    itemKeyOf?: undefined | ((item: I, idx: number) => number | string)
    items: Array<I>
    itemSize: Computable<number, [item: I, idx: number, context: ListVirtualModule.Context]>
    offscreen?: undefined | Computable<number, [context: ListVirtualModule.Context]>
    onLayoutChange?: undefined | ((virtualLayout: undefined | ListVirtualModule.Layout<I>) => Void)
    onRenderChange?: undefined | ((renderState: undefined | ListVirtualModule.LayoutList<I>) => Void)
    resizeThrottleDelay?: undefined | number
    scrollThrottleDelay?: undefined | number
    updatePriority?: undefined | ListVirtualModule.UpdatePriorityEnum
}

export interface ListVirtualRefValue<I> {
    containerRef: React.RefObject<null | HTMLDivElement>
    scrollerRef: React.RefObject<null | HTMLDivElement>
    virtualLayout: undefined | ListVirtualModule.Layout<I>
}

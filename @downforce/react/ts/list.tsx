import {call, compute, type Computable} from '@downforce/std/fn'
import {areObjectsEqualShallow, omitObjectProps} from '@downforce/std/object'
import {isUndefined} from '@downforce/std/optional'
import type {Void} from '@downforce/std/type'
import {areEqualDeepStrict} from '@downforce/std/value'
import {memo, startTransition, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState} from 'react'
import {classes} from './classes.js'
import {useCallbackThrottled} from './defer.js'
import {useEvent} from './event.js'
import {ListVirtualKit, type ListVirtualModule} from './list/api.js'
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
        scrollSizeMax: scrollSizeMaxOptional,
        scrollThrottleDelay: scrollThrottleDelayOptional,
        style,
        updatePriority: updatePriorityOptional,
        ...otherProps
    } = props

    const directionComputable = directionOptional ?? ListVirtualKit.DirectionEnum.Vertical
    const gridComputable = gridOptional ?? 1
    const offscreenComputable = offscreenOptional ?? ListVirtualKit.defaults.offscreen
    const resizeThrottleDelay = resizeThrottleDelayOptional ?? ListVirtualKit.defaults.resizeThrottleDelay
    const scrollSizeMax = scrollSizeMaxOptional ?? ListVirtualKit.defaults.scrollSizeMax
    const scrollThrottleDelay = scrollThrottleDelayOptional ?? ListVirtualKit.defaults.scrollThrottleDelay
    const updatePriority = updatePriorityOptional ?? ListVirtualKit.defaults.updatePriority
    const itemKeyOf = itemKeyOfOptional ?? (ListVirtualKit.computeItemKeyOf as (item: I, idx: number) => number | string)

    const [context, setContext] = useState<undefined | ListVirtualModule.Context>()
    const [scrollPositionKey, setScrollPositionKey] = useState(0)
    const contextRef = useRef(context)
    const windowRef = useRef<Window>(window)
    const containerRef = useRef<HTMLDivElement>(null)
    const scrollerRef = useRef<HTMLDivElement>(null)
    const scrollScalingRef = useRef<ListVirtualModule.ScrollScaling>({offset: 0, scale: 1})

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

        const newContext = ListVirtualKit.computeContext({containerElement, scrollerElement})

        if (areEqualDeepStrict(contextRef.current, newContext)) {
            return
        }

        contextRef.current = newContext

        ListVirtualKit.matchUpdatePriority(updatePriority, {
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

    const updateScrollPositionKey = useCallback((): undefined => {
        const context = contextRef.current

        if (! context) {
            return
        }
        if (! direction) {
            return
        }

        const scrollScale = scrollScalingRef.current.scale

        const scrollPositionKey = ListVirtualKit.matchDirection(direction, {
            horizontal() {
                return ListVirtualKit.computeScrollPositionKey({
                    containerSize: context.containerClient.width,
                    position: (scrollerRef.current?.scrollLeft ?? 0) * scrollScale,
                })
            },
            vertical() {
                return ListVirtualKit.computeScrollPositionKey({
                    containerSize: context.containerClient.height,
                    position: (scrollerRef.current?.scrollTop ?? 0) * scrollScale,
                })
            },
        })

        ListVirtualKit.matchUpdatePriority(updatePriority, {
            high() {
                setScrollPositionKey(scrollPositionKey)
            },
            low() {
                startTransition(() => {
                    setScrollPositionKey(scrollPositionKey)
                })
            },
        })
    }, [direction, updatePriority])

    const updateScrollPositionKeyThrottled = useCallbackThrottled(scrollThrottleDelay, updateScrollPositionKey)

    const updateScrollTranslate = useCallback((): undefined => {
        const scrollerElement = scrollerRef.current
        const {offset, scale} = scrollScalingRef.current

        if (scale === 1) {
            return
        }
        if (! scrollerElement) {
            return
        }
        if (! direction) {
            return
        }

        const translateValue = ListVirtualKit.matchDirection(direction, {
            horizontal() {
                const shift = offset - scrollerElement.scrollLeft * (scale - 1)
                return `${shift}px 0`
            },
            vertical() {
                const shift = offset - scrollerElement.scrollTop * (scale - 1)
                return `0 ${shift}px`
            },
        })

        scrollerElement.style.setProperty('--ListVirtual-scroller-translate', translateValue)
    }, [direction])

    const updateContextAndScrollPositionKey = useCallback(() => {
        updateContext()
        updateScrollPositionKey()
    }, [updateContext, updateScrollPositionKey])

    const updateContextAndScrollPositionKeyThrottled = useCallbackThrottled(resizeThrottleDelay, updateContextAndScrollPositionKey)

    const onScroll = useCallback(() => {
        updateScrollTranslate()
        updateScrollPositionKeyThrottled()
    }, [updateScrollTranslate, updateScrollPositionKeyThrottled])

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

        return ListVirtualKit.computeVirtualLayout({
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

        return ListVirtualKit.computeRenderState({
            offscreen: virtualLayout.offscreen,
            scrollPositionKey: scrollPositionKey,
            virtualLayoutMap: virtualLayout.virtualLayoutMap,
        })
    }, [scrollPositionKey, virtualLayout])

    const scrollScaling = useMemo(() => {
        return ListVirtualKit.computeScrollScaling({
            scrollPositionKey: scrollPositionKey,
            scrollSizeMax: scrollSizeMax,
            virtualLayout: virtualLayout,
        })
    }, [scrollPositionKey, scrollSizeMax, virtualLayout])

    useImperativeHandle<ListVirtualRefValue<I>, ListVirtualRefValue<I>>(refOptional, () => ({
        containerRef: containerRef,
        scrollerRef: scrollerRef,
        scrollScaling: scrollScaling,
        virtualLayout: virtualLayout,
        scrollIntoView(idx, options) {
            const scrollerElement = scrollerRef.current
            const item = virtualLayout?.virtualLayoutList[idx]

            if (! scrollerElement) {
                return
            }
            if (! virtualLayout) {
                return
            }
            if (! item) {
                return
            }

            const position = ListVirtualKit.computeScrollPositionOfItem({
                align: options?.align ?? ListVirtualKit.ScrollAlignEnum.Start,
                item: item,
                scrollPosition: ListVirtualKit.matchDirection(virtualLayout.direction, {
                    horizontal() {
                        return scrollerElement.scrollLeft
                    },
                    vertical() {
                        return scrollerElement.scrollTop
                    },
                }),
                scrollScaling: scrollScaling,
                scrollerSize: ListVirtualKit.matchDirection(virtualLayout.direction, {
                    horizontal() {
                        return scrollerElement.clientWidth
                    },
                    vertical() {
                        return scrollerElement.clientHeight
                    },
                }),
                virtualLayout: virtualLayout,
            })

            scrollerElement.scrollTo({
                behavior: options?.behavior ?? 'auto',
                ...ListVirtualKit.matchDirection(virtualLayout.direction, {
                    horizontal() {
                        return {left: position}
                    },
                    vertical() {
                        return {top: position}
                    },
                }),
            })
        },
    }), [scrollScaling, virtualLayout])

    // We use useEffect instead of useLayoutEffect here, because `updateContext()` reads the DOM,
    // and inside an useLayoutEffect forces the browser to trash the layout with consequent loooooong task:
    // Style + Layout + Paint + Composite.
    useEffect(updateContext, [updateContext])
    useResizeObserver(containerRef, updateContextAndScrollPositionKeyThrottled)
    useEvent(windowRef, 'resize', updateContextAndScrollPositionKeyThrottled, undefined, {passive: true})

    useLayoutEffect(() => {
        if (scrollScalingRef.current.scale !== scrollScaling.scale && scrollScaling.scale === 1) {
            scrollerRef.current?.style.removeProperty('--ListVirtual-scroller-translate')
        }

        scrollScalingRef.current = scrollScaling

        updateScrollTranslate()
    }, [scrollScaling, updateScrollTranslate])

    useEffect(() => {
        updateScrollPositionKey()
    }, [scrollScaling.scale, updateScrollPositionKey])

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
            style={{...style, ...ListVirtualKit.computeContainerStyle(direction)}}
        >
            <div
                ref={scrollerRef}
                className='scroller-26b929'
                style={ListVirtualKit.computeScrollerStyle(direction, virtualLayout?.virtualSize, scrollSizeMax)}
                onScrollCapture={onScroll}
            >
                {context && renderState?.map(it => (
                    <div
                        key={it.key}
                        className='v-item-2602e3'
                        style={ListVirtualKit.computeItemStyle(it, direction, scrollScaling)}
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
    children(item: I, idx: number, itemLayout: ListVirtualModule.LayoutItem<I>, context: ListVirtualModule.Context): React.ReactNode
    direction?: undefined | Computable<ListVirtualModule.DirectionEnum, [context: ListVirtualModule.Context]>
    grid?: undefined | Computable<number, [context: ListVirtualModule.Context]>
    itemKeyOf?: undefined | ((item: I, idx: number) => number | string)
    items: Array<I>
    itemSize: Computable<number, [item: I, idx: number, context: ListVirtualModule.Context]>
    offscreen?: undefined | Computable<number, [context: ListVirtualModule.Context]>
    onLayoutChange?: undefined | ((virtualLayout: undefined | ListVirtualModule.Layout<I>) => Void)
    onRenderChange?: undefined | ((renderState: undefined | ListVirtualModule.LayoutList<I>) => Void)
    resizeThrottleDelay?: undefined | number
    scrollSizeMax?: undefined | number
    scrollThrottleDelay?: undefined | number
    updatePriority?: undefined | ListVirtualModule.UpdatePriorityEnum
}

export interface ListVirtualRefValue<I> {
    containerRef: React.RefObject<null | HTMLDivElement>
    scrollerRef: React.RefObject<null | HTMLDivElement>
    scrollScaling: ListVirtualModule.ScrollScaling
    virtualLayout: undefined | ListVirtualModule.Layout<I>
    scrollIntoView(idx: number, options?: undefined | ListVirtualModule.ScrollIntoViewOptions): undefined
}

import {classes} from '@downforce/react/classes'
import {useCallbackThrottled, useEvent} from '@downforce/react/event'
import type {ElementProps, Props, VoidProps} from '@downforce/react/props'
import {useResizeObserver} from '@downforce/react/resize-observer'
import {call, type Computable, compute} from '@downforce/std/fn'
import {areObjectsEqualShallow, omitObjectProps} from '@downforce/std/object'
import {isUndefined} from '@downforce/std/optional'
import type {Void} from '@downforce/std/type'
import {areEqualDeepStrict} from '@downforce/std/value'
import {memo, startTransition, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState} from 'react'
import {ListVirtualApi as Api, type ListVirtualModule} from './api.js'

export function ListVirtual<I, S>(props: Props<ListVirtualProps<I, S>>): React.JSX.Element {
    const {
        children,
        className,
        debugRender,
        deps,
        direction: directionOptional,
        grid: gridOptional,
        itemKeyOf: itemKeyOfOptional,
        items,
        itemSizeOf,
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

    const directionComputable = directionOptional ?? Api.enums.DirectionEnum.Vertical
    const gridComputable = gridOptional ?? 1
    const offscreenComputable = offscreenOptional ?? Api.defaults.offscreen
    const resizeThrottleDelay = resizeThrottleDelayOptional ?? Api.defaults.resizeThrottleDelay
    const scrollThrottleDelay = scrollThrottleDelayOptional ?? Api.defaults.scrollThrottleDelay
    const updatePriority = updatePriorityOptional ?? Api.defaults.updatePriority
    const itemKeyOf = itemKeyOfOptional ?? (Api.computeItemKeyOf as (item: I, idx: number) => number | string)

    const [context, setContext] = useState<undefined | ListVirtualModule.Context>()
    const [scrollPositionKey, setScrollPositionKey] = useState(0)
    const contextRef = useRef(context)
    const windowRef = useRef<Window>(window)
    const containerRef = useRef<HTMLDivElement>(null)
    const scrollerRef = useRef<HTMLDivElement>(null)

    const direction = context ? compute(directionComputable, context, deps as S) : undefined
    const grid = context ? Math.max(0, compute(gridComputable, context, deps as S)) : undefined
    const offscreen = context ? Math.max(1, compute(offscreenComputable, context, deps as S)) : undefined

    const updateContext = useCallback((): undefined => {
        const containerElement = containerRef.current
        const scrollerElement = scrollerRef.current

        if (! containerElement) {
            return
        }
        if (! scrollerElement) {
            return
        }

        const newContext = Api.computeContext({containerElement, scrollerElement})

        if (areEqualDeepStrict(contextRef.current, newContext)) {
            return
        }

        contextRef.current = newContext

        Api.matchUpdatePriority(updatePriority, {
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

        const newScrollPositionKey = Api.matchDirection(direction, {
            horizontal() {
                return Api.computeVirtualLayoutKeyOf({
                    containerDimension: context.containerClient.width,
                    position: scrollerRef.current?.scrollLeft ?? 0,
                })
            },
            vertical() {
                return Api.computeVirtualLayoutKeyOf({
                    containerDimension: context.containerClient.height,
                    position: scrollerRef.current?.scrollTop ?? 0,
                })
            },
        })

        Api.matchUpdatePriority(updatePriority, {
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

    useLayoutEffect(updateContext, [updateContext])
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

        return Api.computeVirtualLayout({
            context: context,
            deps: deps as S,
            direction: direction,
            grid: grid,
            itemKeyOf: itemKeyOf,
            items: items,
            itemSizeOf: itemSizeOf,
            offscreen: offscreen,
        })
    }, [context, deps, direction, grid, items, offscreen/*, itemKeyOf, itemSizeOf*/])

    const renderState = useMemo(() => {
        if (! virtualLayout) {
            return
        }

        return Api.computeRenderState({
            offscreen: virtualLayout.offscreen,
            scrollPositionKey: scrollPositionKey,
            virtualLayoutMap: virtualLayout.virtualLayoutMap,
        })
    }, [scrollPositionKey, virtualLayout])

    useImperativeHandle<ListVirtualRefValue<I, S>, ListVirtualRefValue<I, S>>(refOptional, () => ({
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
                ...Api.styleOfContainer(direction),
            }}
        >
            <div
                ref={scrollerRef}
                className='scroller-26b929'
                style={Api.styleOfScroller(direction, virtualLayout?.virtualSize)}
                onScrollCapture={onScrollThrottled}
            >
                {renderState?.map(it => (
                    <div
                        key={it.key}
                        className='v-item-2602e3'
                        style={Api.styleOfItem(it, direction)}
                    >
                        {children(it.item, it.idx)}
                    </div>
                ))}
            </div>
        </div>
    )
}

export const ListVirtualMemo = memo(ListVirtual, arePropsEqual) as <I, S>(props: Props<ListVirtualProps<I, S>>) => React.JSX.Element

export function arePropsEqual(
    prevProps: ListVirtualProps<unknown, unknown>,
    nextProps: ListVirtualProps<unknown, unknown>,
): boolean {
    const tests: Array<() => boolean> = [
        () => areObjectsEqualShallow(
            omitObjectProps(prevProps, ['debugRender', 'itemKeyOf', 'itemSizeOf', 'onLayoutChange', 'onRenderChange']),
            omitObjectProps(nextProps, ['debugRender', 'itemKeyOf', 'itemSizeOf', 'onLayoutChange', 'onRenderChange']),
        ),
    ]

    return tests.every(call)
}

// Types ///////////////////////////////////////////////////////////////////////

export interface ListVirtualProps<I, S> extends
    Omit<VoidProps<ElementProps<'div'>>, 'ref'>,
    React.RefAttributes<ListVirtualRefValue<I, S>>
{
    debugRender?: undefined | ((args: {
        renderState: undefined | ListVirtualModule.LayoutList<I>
        virtualLayout: undefined | ListVirtualModule.Layout<I, S>
    }) => Void)
    children(item: I, idx: number): React.ReactElement
    deps?: S
    direction?: undefined | Computable<ListVirtualModule.DirectionEnum, [context: ListVirtualModule.Context, deps: S]>
    grid?: undefined | Computable<number, [context: ListVirtualModule.Context, deps: S]>
    itemKeyOf?: undefined | ((item: I, idx: number) => number | string)
    items: Array<I>
    itemSizeOf(item: I, idx: number, context: ListVirtualModule.Context, deps: S): ListVirtualModule.LayoutBox
    offscreen?: undefined | Computable<number, [context: ListVirtualModule.Context, deps: S]>
    onLayoutChange?: undefined | ((virtualLayout: undefined | ListVirtualModule.Layout<I, S>) => Void)
    onRenderChange?: undefined | ((renderState: undefined | ListVirtualModule.LayoutList<I>) => Void)
    resizeThrottleDelay?: undefined | number
    scrollThrottleDelay?: undefined | number
    updatePriority?: undefined | ListVirtualModule.UpdatePriorityEnum
}

export interface ListVirtualRefValue<I, S> {
    containerRef: React.RefObject<null | HTMLDivElement>
    scrollerRef: React.RefObject<null | HTMLDivElement>
    virtualLayout: undefined | ListVirtualModule.Layout<I, S>
}

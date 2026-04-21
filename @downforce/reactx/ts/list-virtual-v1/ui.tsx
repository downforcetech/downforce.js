import {classes} from '@downforce/react/classes'
import {useCallbackThrottled, useEvent} from '@downforce/react/event'
import type {ElementProps, Props, VoidProps} from '@downforce/react/props'
import {useMergeRefs} from '@downforce/react/ref'
import {useResizeObserver} from '@downforce/react/resize-observer'
import {type Computable, compute} from '@downforce/std/fn'
import {areObjectsEqualShallow, omitObjectProps} from '@downforce/std/object'
import type {Void} from '@downforce/std/type'
import {areEqualDeepStrict} from '@downforce/std/value'
import {memo, startTransition, useCallback, useLayoutEffect, useMemo, useRef, useState} from 'react'
import {ListVirtualApi as Api, type ListVirtualModule} from './api.js'

export function ListVirtual<I, S>(props: Props<ListVirtualProps<I, S>>): React.JSX.Element {
    const {
        advanced,
        children,
        className,
        direction: directionOptional,
        grid: gridOptional,
        itemKeyOf: itemKeyOfOptional,
        items,
        itemSizeOf,
        ref: refOptional,
        state: contextState,
        style,
        ...otherProps
    } = props

    const directionComputable = directionOptional ?? Api.enums.DirectionEnum.Vertical
    const gridComputable = gridOptional ?? 1
    const offscreenComputable = advanced?.offscreen ?? Api.defaults.offscreen
    const resizeThrottleDelay = advanced?.resizeThrottleDelay ?? Api.defaults.resizeThrottleDelay
    const scrollThrottleDelay = advanced?.scrollThrottleDelay ?? Api.defaults.scrollThrottleDelay
    const updatePriority = advanced?.updatePriority ?? Api.defaults.updatePriority
    const itemKeyOf = itemKeyOfOptional ?? (Api.computeItemKeyOf as (item: I, idx: number) => number | string)

    const [context, setContext] = useState<undefined | ListVirtualModule.Context<S>>()
    const [scrollPositionKey, setScrollPositionKey] = useState(0)
    const contextRef = useRef(context)
    const windowRef = useRef<Window>(window)
    const containerRef = useRef<HTMLDivElement>(null)
    const scrollerRef = useRef<HTMLDivElement>(null)
    const ref = useMergeRefs(containerRef, refOptional)

    const updateContext = useCallback((): undefined => {
        const containerElement = containerRef.current
        const scrollerElement = scrollerRef.current

        if (!containerElement) {
            return
        }
        if (!scrollerElement) {
            return
        }

        const newContext = Api.computeContext({
            contextState: contextState as S,
            containerElement,
            scrollerElement,
        })

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
    }, [contextState, updatePriority])

    const updateScroll = useCallback((): undefined => {
        const context = contextRef.current

        if (!context) {
            return
        }

        const direction = compute(directionComputable, context)

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
    }, [directionComputable, updatePriority])

    const updateContextAndScroll = useCallback(() => {
        updateContext()
        updateScroll()
    }, [updateContext, updateScroll])

    const onResizeThrottled = useCallbackThrottled(updateContextAndScroll, resizeThrottleDelay)
    const onScrollThrottled = useCallbackThrottled(updateScroll, scrollThrottleDelay)

    useLayoutEffect(updateContext, [updateContext])
    useResizeObserver(containerRef, onResizeThrottled)
    useEvent(windowRef, 'resize', onResizeThrottled, {passive: true})

    const virtualLayout = useMemo(() => {
        if (!context) {
            return
        }

        return Api.computeVirtualLayout({
            context: context,
            directionComputable: directionComputable,
            gridComputable: gridComputable,
            itemKeyOf: itemKeyOf,
            items: items,
            itemSizeOf: itemSizeOf,
            offscreenComputable: offscreenComputable,
        })
    }, [context, directionComputable, gridComputable, items, offscreenComputable /*, itemKeyOf, itemSizeOf*/])

    const renderState = useMemo(() => {
        if (!virtualLayout) {
            return
        }

        return Api.computeRenderState({
            offscreen: virtualLayout.offscreen,
            scrollPositionKey: scrollPositionKey,
            virtualLayoutMap: virtualLayout.virtualLayoutMap,
        })
    }, [scrollPositionKey, virtualLayout])

    advanced?.debugRender?.({
        renderState: renderState,
        virtualLayout: virtualLayout,
    })

    return (
        <div
            {...otherProps}
            ref={ref}
            className={classes('ListVirtual-2616fa', className)}
            style={{
                ...style,
                ...Api.styleOfContainer(virtualLayout?.direction),
            }}
        >
            <div
                ref={scrollerRef}
                className='scroller-26b929'
                style={Api.styleOfScroller(virtualLayout?.direction, virtualLayout?.virtualSize)}
                onScrollCapture={onScrollThrottled}
            >
                {renderState?.map((it, idx) => (
                    <div
                        key={it.key}
                        className='v-item-2602e3'
                        style={Api.styleOfItem(it, virtualLayout?.direction)}
                    >
                        {children(it.item, it.idx)}
                    </div>
                ))}
            </div>
        </div>
    )
}

export const ListVirtualMemo = memo(ListVirtual, arePropsEqual) as <I, S>(props: Props<ListVirtualProps<I, S>>) => React.JSX.Element

export function arePropsEqual(prevProps: ListVirtualProps<unknown, unknown>, nextProps: ListVirtualProps<unknown, unknown>): boolean {
    const tests: Array<() => boolean> = [
        () =>
            areObjectsEqualShallow(
                omitObjectProps(prevProps, ['advanced', 'itemKeyOf', 'itemSizeOf']),
                omitObjectProps(nextProps, ['advanced', 'itemKeyOf', 'itemSizeOf']),
            ),
    ]
    if (prevProps.advanced || nextProps.advanced) {
        tests.push(() =>
            areObjectsEqualShallow(
                omitObjectProps(prevProps.advanced ?? {}, ['debugRender']),
                omitObjectProps(nextProps.advanced ?? {}, ['debugRender']),
            ),
        )
    }

    return tests.every(runTest => runTest())
}

// Types ///////////////////////////////////////////////////////////////////////

export interface ListVirtualProps<I, S> extends VoidProps<ElementProps<'div'>>, React.RefAttributes<HTMLDivElement> {
    advanced?: undefined | {
        debugRender?: undefined | ((args: {
            renderState: undefined | ListVirtualModule.LayoutList<I>
            virtualLayout: undefined | ListVirtualModule.Layout<I>
        }) => Void)
        offscreen?: undefined | Computable<number, [context: ListVirtualModule.Context<S>]>
        resizeThrottleDelay?: undefined | number
        scrollThrottleDelay?: undefined | number
        updatePriority?: undefined | ListVirtualModule.UpdatePriorityEnum
    }
    children(item: I, idx: number): React.ReactElement
    direction?: undefined | Computable<ListVirtualModule.DirectionEnum, [context: ListVirtualModule.Context<S>]>
    grid?: undefined | Computable<number, [context: ListVirtualModule.Context<S>]>
    itemKeyOf?: undefined | ((item: I) => number | string)
    items: Array<I>
    itemSizeOf(item: I, idx: number, ctx: ListVirtualModule.Context<S>): ListVirtualModule.LayoutBox
    state?: undefined | S
}

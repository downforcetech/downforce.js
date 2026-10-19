import {Enum, type EnumTypeOf, Union, type UnionOf} from '@downforce/std/enum'
import {call, compute, type Computable} from '@downforce/std/fn'
import {getMapValue} from '@downforce/std/map'
import {clamp} from '@downforce/std/number'
import type {ElementOf} from '@downforce/std/type'

const DirectionEnum: {
    Horizontal: 'horizontal'
    Vertical: 'vertical'
} = Enum({
    Horizontal: 'horizontal',
    Vertical: 'vertical',
})

const ScrollAlignEnum: {
    Center: 'center'
    End: 'end'
    Nearest: 'nearest'
    Start: 'start'
} = Enum({
    Center: 'center',
    End: 'end',
    Nearest: 'nearest',
    Start: 'start',
})

const UpdatePriorityEnum: {
    High: 'high'
    Low: 'low'
} = Enum({
    High: 'high',
    Low: 'low',
})

const Presets = {
    scrollScalingDisabled: {offset: 0, scale: 1} satisfies ListVirtualModule.ScrollScaling,
}

export const ListVirtualKit: {
    DirectionEnum: typeof DirectionEnum
    DirectionUnion: UnionOf<typeof DirectionEnum>
    ScrollAlignEnum: typeof ScrollAlignEnum
    ScrollAlignUnion: UnionOf<typeof ScrollAlignEnum>
    UpdatePriorityEnum: typeof UpdatePriorityEnum
    UpdatePriorityUnion: UnionOf<typeof UpdatePriorityEnum>
    defaults: {
        offscreen: number
        resizeThrottleDelay: number
        scrollSizeMax: number
        scrollThrottleDelay: number
        updatePriority: ListVirtualModule.UpdatePriorityEnum
    }
    matchDirection<H, V>(direction: ListVirtualModule.DirectionEnum, matches: {
        horizontal: Computable<H>
        vertical: Computable<V>
    }): H | V
    matchUpdatePriority<H, L>(direction: ListVirtualModule.UpdatePriorityEnum, matches: {
        high: Computable<H>
        low: Computable<L>
    }): H | L
    computeContext(args: {
        containerElement: HTMLElement
        scrollerElement: HTMLElement
    }): ListVirtualModule.Context
    computeVirtualLayout<I>(args: {
        context: ListVirtualModule.Context
        direction: ListVirtualModule.DirectionEnum
        grid: number
        itemKeyOf(item: I, idx: number): number | string
        items: Array<I>
        itemSize: Computable<number, [item: I, idx: number, context: ListVirtualModule.Context]>
        offscreen: number
    }): ListVirtualModule.Layout<I>
    computeRenderState<I>(args: {
        offscreen: number
        scrollPositionKey: number
        virtualLayoutMap: ListVirtualModule.LayoutMap<I>
    }): ListVirtualModule.LayoutList<I>
    computeScrollScaling(args: {
        scrollPositionKey: number
        scrollSizeMax: number
        virtualLayout: undefined | ListVirtualModule.Layout<unknown>
    }): ListVirtualModule.ScrollScaling
    computeScrollPositionOfItem(args: {
        align: ListVirtualModule.ScrollAlignEnum
        item: ListVirtualModule.LayoutItem<unknown>
        scrollPosition: number
        scrollScaling: ListVirtualModule.ScrollScaling
        scrollerSize: number
        virtualLayout: ListVirtualModule.Layout<unknown>
    }): number
    computeItemKeyOf(item: unknown, idx: number): number | string
    computeScrollPositionKey(args: {
        containerSize: number
        position: number
    }): number
    computeContainerStyle(
        direction: undefined | ListVirtualModule.DirectionEnum,
    ): React.CSSProperties
    computeScrollerStyle(
        direction: undefined | ListVirtualModule.DirectionEnum,
        virtualSize: undefined | number,
        scrollSizeMax: number,
    ): React.CSSProperties
    computeItemStyle<I>(
        item: ListVirtualModule.LayoutItem<I>,
        direction: undefined | ListVirtualModule.DirectionEnum,
        scrollScaling?: undefined | ListVirtualModule.ScrollScaling,
    ): React.CSSProperties
} = {
    DirectionEnum: DirectionEnum,
    DirectionUnion: Union(DirectionEnum),
    ScrollAlignEnum: ScrollAlignEnum,
    ScrollAlignUnion: Union(ScrollAlignEnum),
    UpdatePriorityEnum: UpdatePriorityEnum,
    UpdatePriorityUnion: Union(UpdatePriorityEnum),

    defaults: {
        offscreen: 2,
        resizeThrottleDelay: 100,
        scrollSizeMax: 15_000_000, // Chrome ~17M, Firefox ~17M.
        scrollThrottleDelay: 100,
        updatePriority: UpdatePriorityEnum.Low,
    },

    matchDirection(direction, matches) {
        switch (direction) {
            case ListVirtualKit.DirectionEnum.Horizontal:
                return compute(matches.horizontal)
            case ListVirtualKit.DirectionEnum.Vertical:
                return compute(matches.vertical)
        }
    },

    matchUpdatePriority(direction, matches) {
        switch (direction) {
            case ListVirtualKit.UpdatePriorityEnum.High:
                return compute(matches.high)
            case ListVirtualKit.UpdatePriorityEnum.Low:
                return compute(matches.low)
        }
    },

    computeContext(args) {
        const {containerElement, scrollerElement} = args

        return {
            containerClient: {
                height: Math.max(1, containerElement.clientHeight),
                width: Math.max(1, containerElement.clientWidth),
            },
            containerOffset: {
                height: Math.max(1, containerElement.offsetHeight),
                width: Math.max(1, containerElement.offsetWidth),
            },
            scrollerClient: {
                height: Math.max(1, scrollerElement.clientHeight),
                width: Math.max(1, scrollerElement.clientWidth),
            },
            scrollerOffset: {
                height: Math.max(1, scrollerElement.offsetHeight),
                width: Math.max(1, scrollerElement.offsetWidth),
            },
            documentClient: {
                height: Math.max(1, document.documentElement.clientHeight),
                width: Math.max(1, document.documentElement.clientWidth),
            },
            documentOffset: {
                height: Math.max(1, document.documentElement.offsetHeight),
                width: Math.max(1, document.documentElement.offsetWidth),
            },
            windowInner: {
                height: Math.max(1, window.innerHeight),
                width: Math.max(1, window.innerWidth),
            },
            windowOuter: {
                height: Math.max(1, window.outerHeight),
                width: Math.max(1, window.outerWidth),
            },
            windowScreen: {
                height: Math.max(1, window.screen.height),
                width: Math.max(1, window.screen.width),
            },
            windowVisualViewport: {
                height: Math.max(1, window.visualViewport?.height ?? 0),
                width: Math.max(1, window.visualViewport?.width ?? 0),
            },
        }
    },

    computeVirtualLayout(args) {
        const {
            context,
            direction,
            grid,
            itemKeyOf,
            items,
            itemSize,
            offscreen,
        } = args

        const containerDirectionSize = ListVirtualKit.matchDirection(direction, {
            horizontal: context.containerClient.width,
            vertical: context.containerClient.height,
        })

        type I = ElementOf<typeof items>

        const virtualLayoutList: ListVirtualModule.LayoutList<I> = []
        const virtualLayoutMap: ListVirtualModule.LayoutMap<I> = new Map()
        let virtualDirectionSize = 0
        let gridItemDirectionSizeMax = 0

        items.forEach((item, idx) => {
            const itemBaseSize = compute(itemSize, item, idx, context)
            const itemGridIdx = idx % grid
            const itemDirectionOffset = virtualDirectionSize

            const itemLayoutBox = ListVirtualKit.matchDirection(direction, {
                horizontal(): ListVirtualModule.LayoutBox {
                    return {
                        height: context.scrollerClient.height / grid,
                        width: itemBaseSize,
                    }
                },
                vertical(): ListVirtualModule.LayoutBox {
                    return {
                        height: itemBaseSize,
                        width: context.scrollerClient.width / grid,
                    }
                },
            })

            const itemLayoutPosition = ListVirtualKit.matchDirection(direction, {
                horizontal(): ListVirtualModule.LayoutPosition {
                    return {
                        x: itemDirectionOffset,
                        y: (context.scrollerClient.height / grid) * itemGridIdx,
                    }
                },
                vertical(): ListVirtualModule.LayoutPosition {
                    return {
                        x: (context.scrollerClient.width / grid) * itemGridIdx,
                        y: itemDirectionOffset,
                    }
                },
            })

            const virtualItem: ListVirtualModule.LayoutItem<ElementOf<typeof items>> = {
                key: itemKeyOf(item, idx),
                idx: idx,
                item: item,
                height: itemLayoutBox.height,
                width: itemLayoutBox.width,
                x: itemLayoutPosition.x,
                y: itemLayoutPosition.y,
            }

            const layoutKey = ListVirtualKit.computeScrollPositionKey({
                containerSize: containerDirectionSize,
                position: itemDirectionOffset,
            })

            const layoutKeyList = getMapValue(virtualLayoutMap, layoutKey, () => [])

            virtualLayoutList.push(virtualItem)
            layoutKeyList.push(virtualItem)

            gridItemDirectionSizeMax = Math.max(gridItemDirectionSizeMax, itemBaseSize)

            if ((idx + 1) % grid === 0) {
                virtualDirectionSize += gridItemDirectionSizeMax
                gridItemDirectionSizeMax = 0
            }
        })

        if (items.length % grid !== 0) {
            virtualDirectionSize += gridItemDirectionSizeMax
        }

        return {
            context: context,
            direction: direction,
            grid: grid,
            offscreen: offscreen,
            virtualLayoutList: virtualLayoutList,
            virtualLayoutMap: virtualLayoutMap,
            virtualSize: virtualDirectionSize,
        }
    },

    computeRenderState(args) {
        const {offscreen, scrollPositionKey, virtualLayoutMap} = args

        // type I = ElementOf<NonNullable<ReturnType<typeof virtualLayoutMap.get>>>['item']
        type I = typeof virtualLayoutMap extends ListVirtualModule.LayoutMap<infer I> ? I : never

        const renderState: ListVirtualModule.LayoutList<I> = []

        for (let idx = offscreen; idx > 0; --idx) {
            const key = scrollPositionKey - idx
            const items = virtualLayoutMap.get(key) ?? []
            renderState.push(...items)
        }

        {
            const items = virtualLayoutMap.get(scrollPositionKey) ?? []
            renderState.push(...items)
        }

        for (let idx = 1; idx <= offscreen; ++idx) {
            const key = scrollPositionKey + idx
            const items = virtualLayoutMap.get(key) ?? []
            renderState.push(...items)
        }

        return renderState
    },

    computeScrollScaling(args) {
        const {scrollPositionKey, scrollSizeMax, virtualLayout} = args

        if (! virtualLayout) {
            return Presets.scrollScalingDisabled
        }
        if (virtualLayout.virtualSize < scrollSizeMax) {
            return Presets.scrollScalingDisabled
        }

        const {context, direction, virtualSize} = virtualLayout

        const containerSize = ListVirtualKit.matchDirection(direction, {
            horizontal: context.containerClient.width,
            vertical: context.containerClient.height,
        })

        // Maps physical scroll [0, max - container] to virtual scroll [0, virtualSize - container].
        const scale = (virtualSize - containerSize) / (scrollSizeMax - containerSize)
        const virtualAnchor = scrollPositionKey * containerSize
        const scrollAnchor = Math.round(virtualAnchor / scale)
        const offset = virtualAnchor - scrollAnchor

        return {offset: offset, scale: scale}
    },

    computeScrollPositionOfItem(args) {
        const {align, item, scrollPosition, scrollScaling, scrollerSize, virtualLayout} = args
        const {scale} = scrollScaling

        const itemStart = ListVirtualKit.matchDirection(virtualLayout.direction, {
            horizontal: item.x,
            vertical: item.y,
        })
        const itemSize = ListVirtualKit.matchDirection(virtualLayout.direction, {
            horizontal: item.width,
            vertical: item.height,
        })
        const itemEnd = itemStart + itemSize
        const virtualPosition = scrollPosition * scale

        const virtualTarget = call(() => {
            switch (align) {
                case ScrollAlignEnum.Start: return itemStart
                case ScrollAlignEnum.Center: return itemStart + (itemSize - scrollerSize) / 2
                case ScrollAlignEnum.End: return itemEnd - scrollerSize
                case ScrollAlignEnum.Nearest: {
                    if (itemStart < virtualPosition || itemSize > scrollerSize) {
                        return itemStart
                    }
                    if (itemEnd > virtualPosition + scrollerSize) {
                        return itemEnd - scrollerSize
                    }
                    return virtualPosition
                }
            }
        })
        const virtualTargetClamped = clamp(0, virtualTarget, virtualLayout.virtualSize - scrollerSize)

        return virtualTargetClamped / scale
    },

    computeItemKeyOf(item, idx) {
        return idx
    },

    computeScrollPositionKey(args) {
        const {containerSize, position} = args

        return Math.trunc(position / containerSize)
    },

    computeContainerStyle(direction) {
        const sharedStyles: React.CSSProperties = {
            display: 'flex',
        }

        if (! direction) {
            return sharedStyles
        }

        return ListVirtualKit.matchDirection(direction, {
            horizontal(): React.CSSProperties {
                return {
                    ...sharedStyles,
                    flexDirection: 'row',
                    overflow: 'hidden',
                }
            },
            vertical(): React.CSSProperties {
                return {
                    ...sharedStyles,
                    flexDirection: 'column',
                    overflow: 'hidden',
                }
            },
        })
    },

    computeScrollerStyle(direction, virtualSize, scrollSizeMax) {
        const sharedStyles: React.CSSProperties = {
            position: 'relative',
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: 0,
        }

        if (! direction) {
            return sharedStyles
        }

        const scrollSize = Math.min(virtualSize ?? 0, scrollSizeMax)

        return ListVirtualKit.matchDirection(direction, {
            horizontal(): React.CSSProperties {
                return {
                    ...sharedStyles,
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    ['--ListVirtual-scroller-width' as string]: `${scrollSize}px`,
                }
            },
            vertical(): React.CSSProperties {
                return {
                    ...sharedStyles,
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    ['--ListVirtual-scroller-height' as string]: `${scrollSize}px`,
                }
            },
        })
    },

    computeItemStyle(item, direction, scrollScaling) {
        const sharedStyles: React.CSSProperties = {
            position: 'absolute',
            top: item.y,
            left: item.x,
            right: item.x + item.width,
            bottom: item.y + item.height,
            height: item.height,
            width: item.width,
        }

        if (! direction) {
            return sharedStyles
        }
        if (! scrollScaling) {
            return sharedStyles
        }
        if (scrollScaling.scale === 1) {
            return sharedStyles
        }

        return ListVirtualKit.matchDirection(direction, {
            horizontal: (): React.CSSProperties => ({
                ...sharedStyles,
                left: item.x - scrollScaling.offset,
                translate: 'var(--ListVirtual-scroller-translate)',
            }),
            vertical: (): React.CSSProperties => ({
                ...sharedStyles,
                top: item.y - scrollScaling.offset,
                translate: 'var(--ListVirtual-scroller-translate)',
            }),
        })
    },
}

// Types ///////////////////////////////////////////////////////////////////////

export declare namespace ListVirtualModule {
    type DirectionEnum = EnumTypeOf<typeof DirectionEnum>
    type ScrollAlignEnum = EnumTypeOf<typeof ScrollAlignEnum>
    type UpdatePriorityEnum = EnumTypeOf<typeof UpdatePriorityEnum>

    type LayoutList<I> = Array<LayoutItem<I>>
    type LayoutMap<I> = Map<number, LayoutList<I>>

    interface Context {
        containerClient: LayoutBox
        containerOffset: LayoutBox
        scrollerClient: LayoutBox
        scrollerOffset: LayoutBox
        documentClient: LayoutBox
        documentOffset: LayoutBox
        windowInner: LayoutBox
        windowOuter: LayoutBox
        windowScreen: LayoutBox
        windowVisualViewport: LayoutBox
    }

    interface Layout<I> {
        context: Context
        direction: DirectionEnum
        grid: number
        offscreen: number
        virtualLayoutList: LayoutList<I>
        virtualLayoutMap: LayoutMap<I>
        virtualSize: number
    }

    interface LayoutItem<I> extends LayoutBox, LayoutPosition {
        key: number | string
        idx: number
        item: I
    }

    interface ScrollScaling {
        offset: number
        scale: number
    }

    interface LayoutBox {
        height: number
        width: number
    }

    interface LayoutPosition {
        x: number
        y: number
    }

    interface ScrollIntoViewOptions {
        align?: undefined | ScrollAlignEnum
        behavior?: undefined | ScrollBehavior
    }
}

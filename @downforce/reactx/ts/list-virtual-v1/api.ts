import {Enum, type UnionOf} from '@downforce/std/enum'
import {compute, type Computable} from '@downforce/std/fn'
import {getMapValue} from '@downforce/std/map'
import type {ElementOf} from '@downforce/std/type'

const Enums: {
    DirectionEnum: {
        Horizontal: 'horizontal'
        Vertical: 'vertical'
    }
    UpdatePriorityEnum: {
        High: 'high'
        Low: 'low'
    }
} = {
    DirectionEnum: Enum({
        Horizontal: 'horizontal',
        Vertical: 'vertical',
    }),
    UpdatePriorityEnum: Enum({
        High: 'high',
        Low: 'low',
    }),
}

declare namespace Unions {
    type DirectionEnum = UnionOf<typeof Enums.DirectionEnum>
    type UpdatePriorityEnum = UnionOf<typeof Enums.UpdatePriorityEnum>
}

export {Self as ListVirtualApi}

export const Self: {
    enums: {
        DirectionEnum: typeof Enums.DirectionEnum
        UpdatePriorityEnum: typeof Enums.UpdatePriorityEnum
    }

    defaults: {
        offscreen: number
        resizeThrottleDelay: number
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
    computeVirtualLayout<I>(args: {
        context: ListVirtualModule.Context
        directionComputable: Computable<ListVirtualModule.DirectionEnum, [context: ListVirtualModule.Context]>
        gridComputable: Computable<number, [context: ListVirtualModule.Context]>
        itemKeyOf(item: I, idx: number): number | string
        items: Array<I>
        itemSizeOf(item: I, idx: number, sizes: ListVirtualModule.Context): ListVirtualModule.LayoutBox
        offscreenComputable: Computable<number, [context: ListVirtualModule.Context]>
    }): ListVirtualModule.Layout<I>
    computeRenderState<I>(args: {
        offscreen: number
        scrollPositionKey: number
        virtualLayoutMap: ListVirtualModule.LayoutMap<I>
    }): ListVirtualModule.LayoutList<I>
    computeContext(args: {
        containerElement: HTMLElement
        scrollerElement: HTMLElement
    }): ListVirtualModule.Context
    computeItemKeyOf(item: unknown, idx: number): number | string
    computeVirtualLayoutKeyOf(args: {
        containerDimension: number
        position: number
    }): number
    styleOfContainer(
        direction: undefined | ListVirtualModule.DirectionEnum,
    ): React.CSSProperties
    styleOfScroller(
        direction: undefined | ListVirtualModule.DirectionEnum,
        virtualSize: undefined | number,
    ): React.CSSProperties
    styleOfItem<I>(
        item: ListVirtualModule.LayoutItem<I>,
        direction: undefined | ListVirtualModule.DirectionEnum,
    ): React.CSSProperties
} = {
    enums: {
        DirectionEnum: Enums.DirectionEnum,
        UpdatePriorityEnum: Enums.UpdatePriorityEnum,
    },

    defaults: {
        offscreen: 2,
        resizeThrottleDelay: 100,
        scrollThrottleDelay: 100,
        updatePriority: Enums.UpdatePriorityEnum.Low,
    },

    matchDirection(direction, matches) {
        switch (direction) {
            case Self.enums.DirectionEnum.Horizontal:
                return compute(matches.horizontal)
            case Self.enums.DirectionEnum.Vertical:
                return compute(matches.vertical)
        }
    },

    matchUpdatePriority(direction, matches) {
        switch (direction) {
            case Self.enums.UpdatePriorityEnum.High:
                return compute(matches.high)
            case Self.enums.UpdatePriorityEnum.Low:
                return compute(matches.low)
        }
    },

    computeVirtualLayout(args) {
        const {context, directionComputable, gridComputable, itemKeyOf, items, itemSizeOf, offscreenComputable} = args

        const direction = compute(directionComputable, context)
        const grid = compute(gridComputable, context)
        const offscreen = Math.max(1, compute(offscreenComputable, context))

        const containerDirectionSize = Self.matchDirection(direction, {
            horizontal: context.containerClient.width,
            vertical: context.containerClient.height,
        })

        type I = ElementOf<typeof items>

        const virtualLayoutList: ListVirtualModule.LayoutList<I> = []
        const virtualLayoutMap: ListVirtualModule.LayoutMap<I> = new Map()
        let virtualDirectionSize = 0
        let gridItemDirectionSizeMax = 0

        items.forEach((item, idx) => {
            const itemBaseBox = itemSizeOf(item, idx, context)
            const itemGridIdx = idx % grid
            const itemDirectionOffset = virtualDirectionSize

            const itemDirectionSize = Self.matchDirection(direction, {
                horizontal() {
                    return itemBaseBox.width
                },
                vertical() {
                    return itemBaseBox.height
                },
            })

            const itemLayoutBox = Self.matchDirection(direction, {
                horizontal(): ListVirtualModule.LayoutBox {
                    return {
                        height: context.scrollerClient.height / grid,
                        width: itemBaseBox.width,
                    }
                },
                vertical(): ListVirtualModule.LayoutBox {
                    return {
                        height: itemBaseBox.height,
                        width: context.scrollerClient.width / grid,
                    }
                },
            })

            const itemLayoutPosition = Self.matchDirection(direction, {
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

            const layoutKey = Self.computeVirtualLayoutKeyOf({
                containerDimension: containerDirectionSize,
                position: itemDirectionOffset,
            })

            const layoutKeyList = getMapValue(virtualLayoutMap, layoutKey, () => [])

            virtualLayoutList.push(virtualItem)
            layoutKeyList.push(virtualItem)

            gridItemDirectionSizeMax = Math.max(gridItemDirectionSizeMax, itemDirectionSize)

            if ((idx + 1) % grid === 0) {
                virtualDirectionSize += gridItemDirectionSizeMax
                gridItemDirectionSizeMax = 0
            }
        })

        return {
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

    computeItemKeyOf(item, idx) {
        return idx
    },

    computeVirtualLayoutKeyOf(args) {
        const {containerDimension, position} = args

        return Math.trunc(position / containerDimension)
    },

    styleOfContainer(direction) {
        const sharedStyles: React.CSSProperties = {
            display: 'flex',
        }

        if (!direction) {
            return sharedStyles
        }

        return Self.matchDirection(direction, {
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

    styleOfScroller(direction, virtualSize) {
        const sharedStyles: React.CSSProperties = {
            position: 'relative',
            flexGrow: 1,
            flexShrink: 1,
            flexBasis: 0,
        }

        if (!direction) {
            return sharedStyles
        }

        return Self.matchDirection(direction, {
            horizontal(): React.CSSProperties {
                return {
                    ...sharedStyles,
                    overflowX: 'auto',
                    overflowY: 'hidden',
                    ['--VirtualList-scroller-size-horizontal' as string]: `${virtualSize}px`,
                }
            },
            vertical(): React.CSSProperties {
                return {
                    ...sharedStyles,
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    ['--VirtualList-scroller-size-vertical' as string]: `${virtualSize}px`,
                }
            },
        })
    },

    styleOfItem(item, direction) {
        return {
            position: 'absolute',
            top: item.y,
            left: item.x,
            right: item.x + item.width,
            bottom: item.y + item.height,
            height: item.height,
            width: item.width,
        }
    },
}

// Types ///////////////////////////////////////////////////////////////////////

export declare namespace ListVirtualModule {
    type DirectionEnum = Unions.DirectionEnum
    type UpdatePriorityEnum = Unions.UpdatePriorityEnum

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

    interface LayoutBox {
        height: number
        width: number
    }

    interface LayoutPosition {
        x: number
        y: number
    }
}

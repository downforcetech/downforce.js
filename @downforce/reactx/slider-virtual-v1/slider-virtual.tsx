import {classes} from '@downforce/react/classes'
import {useCallbackThrottled} from '@downforce/react/event'
import type {ElementProps, Props, VoidProps} from '@downforce/react/props'
import {useMergeRefs} from '@downforce/react/ref'
import {useResizeObserver} from '@downforce/react/resize-observer'
import {isFunction} from '@downforce/std/fn'
import {useCallback, useLayoutEffect, useMemo, useRef, useState} from 'react'

export function SliderVirtual<I>(props: Props<SliderVirtualProps<I>>): React.JSX.Element {
    const {
        children,
        className,
        ref: refOptional,
        items,
        keyOf,
        selected: selectedItem,
        sizeOf,
        style,
        ...otherProps
    } = props

    const containerRef = useRef<HTMLDivElement>(null)
    const refMerged = useMergeRefs(containerRef, refOptional)
    const [sizes, setSizes] = useState<undefined | VirtualSizes>()

    const updateSize = useCallback(() => {
        if (! containerRef.current) {
            return
        }

        setSizes(computeSizes(containerRef.current))
    }, [])

    useLayoutEffect(updateSize, [])
    useResizeObserver(containerRef, useCallbackThrottled(updateSize, 100))

    const render = useMemo(() => {
        if (! sizes) {
            return []
        }
        return computeVirtualState({items, selectedItem, sizeOf, sizes})
    }, [items, selectedItem, sizeOf, sizes])

    return (
        <div
            {...otherProps}
            ref={refMerged}
            className={classes('SliderVirtual-2f13 std-grid', className)}
            style={{...style, ...styleOfContainer()}}
        >
            {render.map((it, idx) =>
                <div
                    key={keyOf(it.item)}
                    className="v-item-ed22 std-grid-layer"
                    style={styleOfChild(it)}
                >
                    {isFunction(children)
                        ? children(it.item, idx)
                        : children
                    }
                </div>
            )}
        </div>
    )
}

export function computeVirtualState<I>(spec: VirtualSpec<I>): Array<VirtualChild<I>> {
    const {
        items,
        selectedItem: selectedItemOptional,
        sizeOf,
        sizes,
    } = spec

    const selectedItemIdx = selectedItemOptional
        ? items.indexOf(selectedItemOptional)
        : 0
    const selectedItem = items[selectedItemIdx]

    if (! selectedItem) {
        return []
    }

    const child: VirtualChild<I> = {
        ...sizeOf(selectedItem, selectedItemIdx, sizes),
        item: selectedItem,
        idx: selectedItemIdx,
        x: 0,
        y: 0,
    }
    const preChildren = computeChildrenSlice({
        baseX: child.width / 2,
        baseY: child.height / 2,
        direction: -1,
        idxStart: selectedItemIdx - 1,
        items,
        maxHeight: sizes.container.height,
        maxWidth: sizes.container.width,
        sizeOf,
        sizes,
    })
    const postChildren = computeChildrenSlice({
        baseX: child.width / 2,
        baseY: child.height / 2,
        direction: 1,
        idxStart: selectedItemIdx + 1,
        items,
        maxHeight: sizes.container.height,
        maxWidth: sizes.container.width,
        sizeOf,
        sizes,
    })

    return [...preChildren.reverse(), child, ...postChildren]
}

export function computeSizes(containerElement: HTMLElement): VirtualSizes {
    return {
        viewport: {
            width: document.documentElement.offsetWidth,
            height: document.documentElement.offsetHeight,
        },
        container: {
            width: containerElement.offsetWidth,
            height: containerElement.offsetHeight,
        },
    }
}

export function computeChildrenSlice<I>(args: {
    baseX: number
    baseY: number
    direction: -1 | 1
    idxStart: number
    items: Array<I>
    maxHeight: number
    maxWidth: number
    sizeOf: VirtualSizeComputer<I>
    sizes: VirtualSizes
}): Array<VirtualChild<I>> {
    const {
        baseX,
        // baseY,
        direction,
        idxStart,
        items,
        // maxHeight,
        maxWidth,
        sizeOf,
        sizes,
    } = args
    const list: Array<VirtualChild<I>> = []
    let usedSpace = 0
    let itemIdx = idxStart

    while (true) {
        const item = items[itemIdx]
        const freeSpace = maxWidth - usedSpace

        if (! item) {
            // We have no more items.
            break
        }
        if (freeSpace <= 0) {
            // We have no more space to fill.
            break
        }
        if (itemIdx < 0 || itemIdx >= items.length) {
            // We reached the index limit.
            break
        }

        const childSize = sizeOf(item, itemIdx, sizes)
        const childSpace = childSize.width  // TODO: support vertical layout.
        const child: VirtualChild<I> = {
            ...childSize,
            item: item,
            idx: itemIdx,
            x: direction * (
                baseX                       // The translation base point:
                                            // 0 when aligned at start/end,
                                            // > 0 when aligned at center.
                                            // ---------------------------------
                + usedSpace                 // The already filled space.
                                            // ---------------------------------
                + (childSpace / 2)          // The space occupied by this child.
                                            // When centered, only half of
                                            // the size must be translated.
                                            // ---------------------------------
            ),
            y: 0,
        }

        list.push(child)
        usedSpace += childSpace
        itemIdx += direction
    }

    return list
}

export function styleOfContainer(): React.CSSProperties {
    return {
        justifyContent: 'center',
        justifyItems: 'center',
        overflow: 'hidden',
    }
}

export function styleOfChild<I>(child: VirtualChild<I>): React.CSSProperties {
    return {
        width: child.width,
        // height: child.height,
        transform: `translate(${child.x}px, ${child.y}px)`,
    }
}

// Types ///////////////////////////////////////////////////////////////////////

export interface SliderVirtualProps<I> extends Omit<VoidProps<ElementProps<'div'>>, 'onSelect'> {
    // align: undefined | 'start' | 'center' | 'end'
    children: (item: I, idx: number) => React.ReactElement
    // direction: undefined | 'horizontal' | 'vertical'
    items: Array<I>
    keyOf: (item: I) => string | number
    selected: undefined | I
    sizeOf: VirtualSizeComputer<I>
}

export interface VirtualSpec<I> {
    items: Array<I>
    selectedItem: undefined | I
    sizeOf: VirtualSizeComputer<I>
    sizes: VirtualSizes
}

export interface VirtualSizes {
    viewport: Size
    container: Size
}

export interface VirtualSizeComputer<I> {
    (item: I, idx: number, sizes: VirtualSizes): Size
}

export interface Size {
    width: number
    height: number
}

export interface VirtualChild<I> {
    item: I
    idx: number
    width: number
    height: number
    x: number
    y: number
}

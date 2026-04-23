import {useCallback, useMemo, useState} from 'react'
import {NoDeps, type HookDeps} from './hook.js'
import type {StateManager, StateWriter} from './state.js'

const NoItems: [] = []

export function useFilter<I, F>(
    items: undefined | Array<I>,
    initialState: F | (() => F),
    onTestCallback: (state: F, item: I, idx: number) => boolean,
    deps?: undefined | HookDeps,
): FilterManager<I, F> {
    const onTestMemoized = useCallback(onTestCallback, deps ?? NoDeps)
    const [state, setState] = useState<F>(initialState) as StateManager<F>

    const filteredItems = useMemo(() => {
        if (! items) {
            return NoItems
        }
        return items.filter((it, idx) => onTestMemoized(state, it, idx))
    }, [onTestMemoized, items, state])

    const itemIdxOf = useCallback((filteredItemIdx: number) => {
        return resolveFilteredItemIdx(items ?? NoItems, filteredItems, filteredItemIdx)
    }, [items, filteredItems])

    return useMemo(() => ({
        state,
        items: filteredItems,
        itemIdxOf,
        setState,
    }), [
        state,
        filteredItems,
        itemIdxOf,
        setState,
    ])
}

export function resolveFilteredItemIdx<I>(
    items: Array<I>,
    filteredItems: Array<I>,
    filteredItemIdx: number,
): undefined | number {
    const filteredItem = filteredItems[filteredItemIdx]

    if (! filteredItem) {
        return
    }

    const itemIdx = items.indexOf(filteredItem)

    return (itemIdx >= 0)
        ? itemIdx
        : undefined
}

// Types ///////////////////////////////////////////////////////////////////////

export interface FilterManager<I, F> {
    items: Array<I>
    itemIdxOf(filteredItemIdx: number): undefined | number
    state: F
    setState: StateWriter<F>
}

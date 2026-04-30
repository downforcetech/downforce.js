import {useCallback, useMemo} from 'react'
import {useFn, type HookDeps} from './hook.js'
import {useState3, type StateReader, type StateWriter} from './state.js'

const NoItems: [] = []

export function useFilter<S, I>(
    items: undefined | Array<I>,
    initialState: S | (() => S),
    onTest: (state: S, item: I, idx: number) => boolean,
    deps?: undefined | HookDeps,
): FilterManager<S, I> {
    const onTestMemoized = useFn(onTest, deps)
    const [state, setState, getState] = useState3(initialState)

    const filteredItems = useMemo(() => {
        if (! items) {
            return NoItems
        }
        return items.filter((it, idx) => onTestMemoized(state, it, idx))
    }, [items, onTestMemoized, state])

    const getItemIdx = useCallback((filteredItemIdx: number) => {
        return resolveFilteredItemIdx(items ?? NoItems, filteredItems, filteredItemIdx)
    }, [items, filteredItems])

    return useMemo(() => ({
        getItemIdx,
        items: filteredItems,
        state,
        setState,
        getState,
    }), [
        getItemIdx,
        filteredItems,
        state,
        setState,
        getState,
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

export interface FilterManager<S, I> {
    getItemIdx(filteredItemIdx: number): undefined | number
    items: Array<I>
    state: S
    getState: StateReader<S>
    setState: StateWriter<S, S>
}

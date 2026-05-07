import type {None} from '@downforce/std/optional'
import {useEffect} from 'react'
import {useCallback2, type HookDeps} from './memo.js'

export function useResizeObserver(
    containerRef: React.RefObject<None | HTMLElement>,
    onResize: ResizeObserverCallback,
    deps?: undefined | HookDeps,
    options?: undefined | UseResizeObserverOptions,
): undefined {
    const onResizeMemoized = useCallback2(onResize, deps)
    const active = options?.active ?? true

    useEffect(() => {
        if (! active) {
            return
        }

        const containerElement = containerRef.current

        if (! containerElement) {
            return
        }

        const observer = new ResizeObserver(onResizeMemoized)

        observer.observe(containerElement)

        function onClean() {
            observer.disconnect()
        }

        return onClean
    }, [onResizeMemoized, active])
}

// Types ///////////////////////////////////////////////////////////////////////

export interface UseResizeObserverOptions {
    active?: undefined | boolean
}

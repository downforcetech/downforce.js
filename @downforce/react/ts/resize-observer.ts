import type {None} from '@downforce/std/optional'
import {useCallback, useEffect} from 'react'

export function useResizeObserver(
    containerRef: React.RefObject<None | HTMLElement>,
    onResize: ResizeObserverCallback,
    options?: undefined | UseResizeObserverOptions,
    deps?: undefined | Array<unknown>,
): undefined {
    const onResizeMemoized = deps ? useCallback(onResize, deps) : onResize
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

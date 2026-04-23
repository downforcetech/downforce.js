import type {None} from '@downforce/std/optional'
import {useCallback, useEffect} from 'react'
import {NoDeps, type HookDeps} from './hook.js'

export function useResizeObserver(
    containerRef: React.RefObject<None | HTMLElement>,
    onResizeCallback: ResizeObserverCallback,
    deps?: undefined | HookDeps,
    options?: undefined | UseResizeObserverOptions,
): undefined {
    const onResizeMemoized = useCallback(onResizeCallback, deps ?? NoDeps)
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

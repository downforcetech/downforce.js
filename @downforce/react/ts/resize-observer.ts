import type {None} from '@downforce/std/optional'
import {useEffect} from 'react'

export function useResizeObserver(
    containerRef: React.RefObject<None | HTMLElement>,
    onResize: ResizeObserverCallback,
): void {
    useEffect(() => {
        const containerEl = containerRef.current

        if (! containerEl) {
            return
        }

        const observer = new ResizeObserver(onResize)

        observer.observe(containerEl)

        function onClean() {
            observer.disconnect()
        }

        return onClean
    }, [onResize])
}

import {useRef, useLayoutEffect} from 'react'

export function usePreviousRef<T>(value: T): React.RefObject<undefined | T> {
    const prevValueRef = useRef<T>(undefined)

    useLayoutEffect(() => {
        function onClean() {
            prevValueRef.current = value
        }

        return onClean
    }, [value])

    return prevValueRef
}

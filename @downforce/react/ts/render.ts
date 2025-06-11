import type {Task} from '@downforce/std/fn'
import {useCallback} from 'react'
import {useStateTransition} from './state.js'

/*
* Used to force the rendering of a component.
*/
export function useRender(): Task {
    const [signal, render] = useRenderSignal()

    return render
}

export function useRenderSignal(): [RenderSignal, Task] {
    const [signal, setSignalTransition] = useStateTransition([])

    const notify = useCallback(() => {
        // Don't use -1/1 or !boolean, which don't work on even number of consecutive calls.
        // Don't use ++number, which can overflow Number.MAX_SAFE_INTEGER.
        // [] is faster and memory cheaper than
        // {} which is faster than
        // Object.create(null).
        setSignalTransition([])
    }, [])

    return [signal, notify]
}

// Types ///////////////////////////////////////////////////////////////////////

export type RenderSignal = never[]

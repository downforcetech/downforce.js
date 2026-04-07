import type {Task} from '@downforce/std/fn'
import type {None} from '@downforce/std/optional'
import {useCallback, useEffect, type RefObject} from 'react'

export function usePictureInPicture(
    videoRef: RefObject<None | HTMLVideoElement>,
    options?: undefined | {
        onEnter?: undefined | Task
        onExit?: undefined | Task
        onError?: undefined | Task
    },
): {
    enter(): undefined
    exit(): undefined
    toggle(): undefined
} {
    const {onEnter, onError, onExit} = options ?? {}

    useEffect(() => {
        if (onEnter) {
            videoRef.current?.addEventListener('enterpictureinpicture', onEnter, false)
        }
        if (onExit) {
            videoRef.current?.addEventListener('leavepictureinpicture', onExit, false)
        }
    }, [onEnter, onExit])

    const enter = useCallback((): undefined => {
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture()
                .catch(onError)
                .then(() => videoRef.current?.requestPictureInPicture())
                .then(onEnter, onError)
        }
        else {
            videoRef.current?.requestPictureInPicture().then(onEnter, onError)
        }

    }, [onEnter, onError])

    const exit = useCallback((): undefined => {
        if (document.pictureInPictureElement) {
            document.exitPictureInPicture().then(onExit, onError)
        }
    }, [onExit, onError])

    const toggle = useCallback((): undefined => {
        if (document.pictureInPictureElement) {
            exit()
        }
        else {
            enter()
        }
    }, [enter, exit])

    return {enter, exit, toggle}
}

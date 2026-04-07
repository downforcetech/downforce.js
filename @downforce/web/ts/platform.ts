export const FullscreenEvents = 'fullscreenchange webkitfullscreenchange MSFullscreenChange'

export function addFullscreenChangeListener(
    target: FullscreenDocument,
    callback: EventListener,
    capture?: undefined | boolean,
): undefined {
    FullscreenEvents.split(' ').forEach(event => {
        target.addEventListener(event, callback, capture ?? false)
    })
}

export function removeFullscreenChangeListener(
    target: FullscreenDocument,
    callback: EventListener,
    capture?: undefined | boolean,
): undefined {
    FullscreenEvents.split(' ').forEach(event => {
        target.removeEventListener(event, callback, capture ?? false)
    })
}

export function fullscreenElement(target: FullscreenDocument): undefined | Element {
    const element =
        target.fullscreenElement
        || target.webkitFullscreenElement
        || target.msFullscreenElement

    return element ?? undefined
}

export function exitFullscreen(target: FullscreenDocument): undefined | Promise<undefined> {
    const iface =
        target.exitFullscreen
        || target.webkitExitFullscreen
        || target.msExitFullscreen

    if (! iface) {
        return
    }

    return iface.apply(target) as Promise<undefined>
}

export function requestFullscreen(target: FullscreenElement): undefined | Promise<undefined> {
    const iface =
        target.requestFullscreen
        || target.webkitRequestFullscreen
        || target.msRequestFullscreen

    if (! iface) {
        return
    }

    return iface.apply(target) as Promise<undefined>
}

// Types ///////////////////////////////////////////////////////////////////////

export type FullscreenDocument = HTMLDocument & {
    webkitFullscreenElement?: undefined | HTMLDocument['fullscreenElement']
    msFullscreenElement?: undefined | HTMLDocument['fullscreenElement']
    webkitExitFullscreen?: undefined | HTMLDocument['exitFullscreen']
    msExitFullscreen?: undefined | HTMLDocument['exitFullscreen']
}

export type FullscreenElement = HTMLElement & {
    webkitRequestFullscreen?: undefined | HTMLElement['requestFullscreen']
    msRequestFullscreen?: undefined | HTMLElement['requestFullscreen']
}

export function hasBrowserTouch(): boolean {
    if (window.ontouchstart) {
        return true
    }
    // @ts-expect-error
    if (navigator.maxTouchPoints || navigator.msMaxTouchPoints) {
        return true
    }
    // @ts-expect-error
    if (window.DocumentTouch && document instanceof DocumentTouch) {
        return true
    }
    return false
}

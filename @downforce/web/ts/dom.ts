export function removeChildren(element: Element): undefined {
    while (element.lastChild) {
        element.lastChild.remove()
    }
}

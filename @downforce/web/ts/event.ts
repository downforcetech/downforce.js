export function preventEventDefault(event: Pick<Event, 'preventDefault'>): undefined {
    event.preventDefault()
}

export function stopEventPropagation(event: Pick<Event, 'stopPropagation'>): undefined {
    event.stopPropagation()
}

export function stopEventPropagationImmediately(event: Pick<Event, 'stopImmediatePropagation'>): undefined {
    event.stopImmediatePropagation()
}

export function cancelEvent(event: Pick<Event, 'preventDefault' | 'stopPropagation'>): undefined {
    event.preventDefault()
    event.stopPropagation()
}

export function cancelEventImmediately(event: Pick<Event, 'preventDefault' | 'stopImmediatePropagation'>): undefined {
    event.preventDefault()
    event.stopImmediatePropagation()
}

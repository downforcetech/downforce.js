import {returnUndefined, tryCatch, type Task} from '@downforce/std/fn'
import {useEventListener, useMounted, WebElement} from '@downforce/web/element'

/*
* EXAMPLE
*
* customElements.define('html-sandbox', HtmlSandbox)
*
* <html-sandbox>
*     <style>
*         p { color: red; }
*     </style>
*
*     <p>Hello World!</p>
* </html-sandbox>
*/
export class HtmlSandbox extends WebElement {
    static getImplementation(): {
        onContentChange(element: HTMLElement): undefined
        onHashChange(element: HTMLElement): undefined
    } {
        return Implementation
    }

    constructor() {
        super()

        this.attachShadow({mode: 'open'})

        useMounted(this, () => {
            Implementation.onMounted(this)
        })

        useEventListener(this, window, 'hashchange', Implementation.onHashChange.bind(this, this))
    }

    override connectedCallback(): undefined {
        Implementation.onContentChange(this)
    }
}

const Implementation = {
    onMounted(element: HTMLElement): Task {
        const observer = new MutationObserver(() => Implementation.onContentChange(element))
        observer.observe(element, {subtree: true, characterData: true})

        function onUnmount(): undefined {
            observer.disconnect()
        }

        return onUnmount
    },

    onContentChange(element: HTMLElement): undefined {
        if (! element.shadowRoot) {
            return
        }

        const children = Array.from(element.childNodes)
        const html = children.map(it => it.textContent).join('\n')

        element.shadowRoot.innerHTML = html

        Implementation.onHashChange(element)
    },

    onHashChange(element: HTMLElement): undefined {
        const target = tryCatch(() => {
            if (! element.shadowRoot) {
                return
            }
            if (! window.location.hash) {
                return
            }

            const id = window.location.hash
            const shadowElement = element.shadowRoot.querySelector<HTMLElement>(id)

            return shadowElement
        }, returnUndefined)

        if (! target) {
            return
        }

        // We can't use {behavior:'smooth'} because the Safari shim/polyfill
        // does not work inside Web Components.
        target.scrollIntoView()
    },
}

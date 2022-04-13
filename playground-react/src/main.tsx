if (__WITH_PREACT__ === true && __MODE__ !== 'production') {
    require('preact/debug')
}

import {createContainer} from '@eviljs/std/container'
import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {ContainerSpec} from './container'
import * as Context from './context'
import {Root, RootContext} from './root'

import '~/style.css'

console.table({...Context})

const container = createContainer(ContainerSpec)
const rootElement = document.getElementById('App') ?? document.body
const root = createRoot(rootElement)

root.render(
    <StrictMode>
        <RootContext container={container}>
            <Root/>
        </RootContext>
    </StrictMode>
)

// Hot Module Replacement (development mode)
if (module.hot) {
    module.hot.accept()
}

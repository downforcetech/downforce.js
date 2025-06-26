import {deserializeStruct, serializeStruct} from '@downforce/std/serial'

export {deserializeStruct as deserializeSsrState, serializeStruct as serializeSsrState} from '@downforce/std/serial'

export async function saveSsrState(id: string, payload: unknown, options?: undefined | SsrSaveOptions): Promise<void> {
    if (! payload) {
        return
    }

    const inject = options?.inject ?? injectSsrStorageElement
    const ssrStorage = findSsrStorageElement(id) ?? inject(id)

    return serializeSsrStateIntoStorageElement(ssrStorage, payload, options?.serializer)
}

export async function serializeSsrStateIntoStorageElement(
    element: Element,
    payload: unknown,
    serializerOptional?: undefined | SsrPayloadSerializer,
): Promise<void> {
    const serialize: SsrPayloadSerializer = serializerOptional ?? serializeStruct

    element.textContent = (await serialize(payload)) ?? null
}

export async function loadSsrState(id: string, options?: undefined | SsrLoadOptions): Promise<unknown> {
    const ssrStorage = findSsrStorageElement(id)

    if (! ssrStorage) {
        return
    }

    return deserializeSsrStateFromStorageElement(ssrStorage, options?.deserializer)
}

export async function deserializeSsrStateFromStorageElement(
    element: Element,
    deserializeOptional?: undefined | SsrPayloadDeserializer,
): Promise<unknown> {
    const deserialize: SsrPayloadDeserializer = deserializeOptional ?? deserializeStruct
    const payloadSerialized = readSsrStateFromStorageElement(element)

    if (! payloadSerialized) {
        return
    }

    return deserialize(payloadSerialized)
}

export function findSsrStorageElement(id: string): undefined | Element {
    const ssrElementsSelector = 'script[type="application/json"][data-type="ssr-data"]'
    const ssrElements = document.querySelectorAll(ssrElementsSelector)
    const ssrElement = Array.from(ssrElements).find(it => it.id === id)

    return ssrElement
}

export function injectSsrStorageElement(id: string): HTMLScriptElement {
    const element = createSsrStorageElement(id)

    document.body.appendChild(element)

    return element
}

export function createSsrStorageElement(id: string): HTMLScriptElement {
    const element = document.createElement('script')

    element.type = 'application/json'
    element.dataset.type = 'ssr-data'
    element.id = id

    return element
}

export function readSsrStateFromStorageElement(element: Element): undefined | string {
    return element.textContent?.trim() || undefined
}

// Types ///////////////////////////////////////////////////////////////////////

export interface SsrSaveOptions {
    inject?: undefined | ((id: string) => Element)
    serializer?: undefined | SsrPayloadSerializer
}

export interface SsrLoadOptions {
    deserializer?: undefined | SsrPayloadDeserializer
}

export interface SsrPayloadSerializer {
    (payload: unknown): Promise<undefined | string>
}

export interface SsrPayloadDeserializer {
    (payloadSerialized: string): Promise<unknown>
}

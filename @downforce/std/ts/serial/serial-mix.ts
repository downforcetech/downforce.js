export function serializeAsJson(payload: unknown): string {
    return JSON.stringify(payload)
}

export function deserializeFromJson(payloadSerialized: string): unknown {
    return JSON.parse(payloadSerialized)
}

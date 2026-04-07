// We don't define isStringNotEmpty as a type predicate, because would lead to an incorrect control flow.
// export function isStringNotEmpty(value: unknown): value is string
export function isStringNotEmpty(value: string): boolean {
    return Boolean(value.trim())
}

export function capitalizeFirst(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

export function capitalizeEveryWord(text: string): string {
    return text.split(' ').map(capitalizeFirst).join(' ')
}

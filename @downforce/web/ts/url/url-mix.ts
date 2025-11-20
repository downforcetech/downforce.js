export const UrlSchemaRegexp: RegExp = /^([a-zA-Z0-9]+):/ // "http://" "https://" "mailto:" "tel:"

export function isUrlWithScheme(url: string): boolean {
    return url.startsWith('//') || UrlSchemaRegexp.test(url)
}

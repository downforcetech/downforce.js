import {isUrlWithScheme} from '../url/url-mix.js'
import {joinUrlPaths} from '../url/url-path.js'

export function joinRequestPath(baseUrl: undefined | string, path: string): string {
    if (! baseUrl) {
        return path
    }
    if (isUrlWithScheme(path)) {
        return path
    }
    return joinUrlPaths(baseUrl, path)
}

export function resolveRequestPath(pathOrUrl: string, baseUrl?: undefined | string): string {
    return joinRequestPath(baseUrl, pathOrUrl)
    // return new URL(pathOrUrl, baseUrl).href
}

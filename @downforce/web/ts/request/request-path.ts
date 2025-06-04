import {isUrlAbsolute, joinUrlPaths} from '../url.js'

export function joinRequestPath(baseUrl: undefined | string, path: string): string {
    if (! baseUrl) {
        return path
    }
    if (isUrlAbsolute(path)) {
        return path
    }
    return joinUrlPaths(baseUrl, path)
}

export function resolveRequestPath(pathOrUrl: string, baseUrl?: undefined | string): string {
    return joinRequestPath(baseUrl, pathOrUrl)
    // return new URL(pathOrUrl, baseUrl).href
}

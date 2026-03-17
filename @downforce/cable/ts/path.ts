import {call} from '@downforce/std/fn'
import Path from 'node:path'

export function listPathHierarchy(
    path: string,
    options?: undefined | ListPathHierarchyOptions,
): Array<string> {
    const reverse = options?.reverse ?? false
    const separator = options?.separator ?? Path.sep

    // abc/xyz/ => ./abc/xyz/
    const pathNormalized = call(() => {
        if (path.startsWith(separator)) {
            return path
        }
        if (path.startsWith(`.${separator}`)) {
            return path
        }
        if (path === '.') {
            return path
        }
        if (separator === '\\' && path.match(/^[a-zA-Z0-9]+:/)) {
            // We are handling Microsoft Windows root path 'C:\...' case.
            return path
        }
        return `.${separator}${path}`
    })

    const pathEndsWithSeparator = pathNormalized.endsWith(separator)

    // /abc/xyz   => 3: '' 'abc' 'xyz'
    // /abc/xyz/  => 4: '' 'abc' 'xyz' ''
    // ./abc/xyz/ => 4: '.' 'abc' 'xyz' ''
    const pathParts = pathNormalized.split(separator).filter((it, idx) => {
        if (idx > 0 && it === '') {
            // We are removing the trailing separator '.../' case.
            // We are removing the double separator '...//...' case.
            return false
        }
        return true
    })
    const pathPartsSize = pathParts.length

    // /abc/xyz   => 3: '' 'abc' 'xyz'
    // /abc/xyz/  => 3: '' 'abc' 'xyz'
    // ./abc/xyz/ => 3: '.' 'abc' 'xyz'
    const list = pathParts.map((it, idx) => {
        if (idx === 0 && it === '') {
            // We are handling the leading separator '/...' case.
            return separator
        }
        if (it === '.') {
            return it
        }

        const itJoined = pathParts.slice(0, idx + 1).join(separator)

        if (
            (idx + 1) === pathPartsSize
            && ! pathEndsWithSeparator
        ) {
            // We are handling the not trailing separator '.../' case.
            return itJoined
        }
        return itJoined + separator
    })

    if (reverse) {
        return list.reverse()
    }
    return list
}

// Types ///////////////////////////////////////////////////////////////////////

export interface ListPathHierarchyOptions {
    reverse?: undefined | boolean
    separator?: undefined | string
}

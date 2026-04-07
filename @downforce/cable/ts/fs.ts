import {call, returnFalse, returnTrue} from '@downforce/std/fn'
import type {Stats} from 'node:fs'
import Fs from 'node:fs/promises'
import Path from 'node:path'

export function isPathReadable(path: string): Promise<boolean> {
    return Fs.access(path, Fs.constants.F_OK).then(returnTrue, returnFalse)
}

export function isPathSymbolicLink(path: string): Promise<boolean> {
    return Fs.lstat(path).then(attrs => attrs.isSymbolicLink(), returnFalse)
}

export async function walkPath(
    path: string,
    handlers?: undefined | {
        filter?: undefined | ((entry: FsWalkPathEntry) => boolean)
        onEntry?: undefined | ((entry: FsWalkPathEntry) => undefined)
        onDir?: undefined | ((dirPath: string) => undefined)
        onFile?: undefined | ((filePath: string) => undefined)
        onLink?: undefined | ((linkPath: string) => undefined)
    },
): Promise<Array<FsWalkPathEntry>> {
    const files: Array<FsWalkPathEntry> = []

    for await (const entry of iteratePath(path, handlers?.filter)) {
        files.push(entry)

        handlers?.onEntry?.(entry)
        switch (entry.type) {
            case 'dir':
                handlers?.onDir?.(entry.path)
            break
            case 'file':
                handlers?.onFile?.(entry.path)
            break
            case 'link':
                handlers?.onLink?.(entry.path)
            break
        }
    }

    return files
}

export async function* iteratePath(
    path: string,
    filter?: undefined | ((entry: FsWalkPathEntry) => boolean),
): AsyncGenerator<FsWalkPathEntry, undefined, undefined> {
    const attrs = await Fs.lstat(path)

    if (! attrs) {
        return
    }

    const entryType = call((): undefined | FsWalkPathEntryType => {
        if (attrs.isDirectory()) {
            return 'dir'
        }
        if (attrs.isFile()) {
            return 'file'
        }
        if (attrs.isSymbolicLink()) {
            return 'link'
        }
        return
    })

    if (! entryType) {
        return
    }

    const entry: FsWalkPathEntry = {
        type: entryType,
        path: path,
        attrs: attrs,
    }

    if ((filter?.(entry) ?? true) === false) {
        return
    }

    yield entry

    switch (entry.type) {
        case 'file': return
        case 'link': return
    }

    // Directory.
    const children = await Fs.readdir(path)

    if (! children) {
        return
    }

    for (const childFileName of children) {
        const childFilePath = Path.join(path, childFileName)
        yield* iteratePath(childFilePath, filter)
    }

    return
}

// Types ///////////////////////////////////////////////////////////////////////

export interface FsWalkPathEntry {
    type: FsWalkPathEntryType
    path: string
    attrs: Stats
}

export type FsWalkPathEntryType = 'dir' | 'file' | 'link'

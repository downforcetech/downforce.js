import {type Computable, compute} from '@downforce/std/fn'
import {isDefined} from '@downforce/std/optional'
import type {ObjectPartial} from '@downforce/std/type'
import type {CableStoreGeneric} from './cable-types.js'
import type {CablePlugInterface} from './plug-types.js'

export class Cable<S extends CableStoreGeneric> {
    defaults: S
    plugs: Array<CablePlugInterface<S>> = []

    constructor(defaults: Computable<S>) {
        this.defaults = compute(defaults)
    }

    use(...plugs: Array<CablePlugInterface<S>>): Cable<S> {
        this.plugs.push(...plugs)

        return this
    }

    async resolve(): Promise<S> {
        const tasksPromises = this.plugs.map(it => it.load())
        const tasksResults: Array<undefined | ObjectPartial<S>> = await Promise.all(tasksPromises)
        const lookups = tasksResults.filter(isDefined)

        return lookupKeysValues(this.defaults, lookups)
    }
}

export function lookupKeysValues<S extends CableStoreGeneric>(
    defaults: S,
    lookups: Array<ObjectPartial<S>>,
): S {
    const keysValues = {...defaults}

    for (const key in defaults) {
        keysValues[key] = lookupKeyValue(lookups, key) ?? defaults[key]
    }

    return keysValues
}

export function lookupKeyValue<S extends CableStoreGeneric, K extends keyof S>(
    lookups: Array<ObjectPartial<S>>,
    key: K,
): undefined | S[K] {
    for (const lookup of lookups) {
        const value = lookup[key as keyof S]

        if (isDefined(value)) {
            return value
        }
    }
    return
}

import {getObjectPath, matchObject, setObjectPath} from '@downforce/std/object'
import {cloneDeep} from '@downforce/std/struct'
import {expectType} from '@downforce/std/type'
import Assert from 'node:assert/strict'
import {describe, test} from 'node:test'

const objectPathKey = [0, 'Hello World', 1, 'key']
const objectPathValue = 'initial value'
const object = [
    {'Hello World': {1: {key: objectPathValue}}},
]

describe('@downforce/std/object', (ctx) => {
    test('matchObject()', (ctx) => {
        {
            const input = undefined as unknown

            matchObject(input, expectType<Record<PropertyKey, unknown>>)
            expectType<Record<PropertyKey, unknown> | 123>(matchObject(input, expectType<Record<PropertyKey, unknown>>, unknown => 123))
        }
        {
            const input = undefined as {name: string} | undefined | null | 'A' | number | Array<string>

            matchObject(input, expectType<{name: string}>)
            matchObject(input, expectType<{name: string}>, expectType<undefined | null | 'A' | number | Array<string>>)
        }
    })

    test('getObjectPath()', (ctx) => {
        Assert.equal(getObjectPath(object, objectPathKey), objectPathValue)
    })

    test('setObjectPath()', (ctx) => {
        const newObject = cloneDeep(object)
        const newValue = 'replaced value'
        const oldValue = setObjectPath(newObject, objectPathKey, newValue)

        Assert.equal(oldValue, objectPathValue)
        Assert.equal(newObject[0]!['Hello World'][1].key, newValue)
    })
})

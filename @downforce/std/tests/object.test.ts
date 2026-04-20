import {areObjectsEqualShallow, areObjectsEqualShallowStrict, getObjectPath, matchObject, setObjectPath} from '@downforce/std/object'
import {expectType} from '@downforce/std/type'
import {cloneDeep} from '@downforce/std/value'
import Assert from 'node:assert/strict'
import {describe, test} from 'node:test'

describe('@downforce/std/object', (ctx) => {
    test('areObjectsEqualShallow()', (ctx) => {
        {
            const actual = areObjectsEqualShallow(
                {undefined: undefined, null: null, bool: true, nan: NaN, number: 123, string: 'abc'},
                {undefined: undefined, null: null, bool: true, nan: NaN, number: 123, string: 'abc', prop: undefined},
            )

            Assert.equal(actual, true)
        }
    })

    test('areObjectsEqualShallowStrict()', (ctx) => {
        {
            const actual = areObjectsEqualShallowStrict(
                {undefined: undefined, null: null, bool: true, nan: NaN, number: 123, string: 'abc'},
                {undefined: undefined, null: null, bool: true, nan: NaN, number: 123, string: 'abc'},
            )

            Assert.equal(actual, true)
        }
        {
            const actual = areObjectsEqualShallowStrict(
                {undefined: undefined, null: null, bool: true, nan: NaN, number: 123, string: 'abc'},
                {undefined: undefined, null: null, bool: true, nan: NaN, number: 123, string: 'abc', prop: undefined},
            )

            Assert.equal(actual, false)
        }
    })

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

    const objectRoot = [{'Hello World': {1: {key: 'initial value'}}}]

    test('getObjectPath()', (ctx) => {
        Assert.equal(getObjectPath(objectRoot, [0, 'Hello World', 1, 'key']), 'initial value')
    })

    test('setObjectPath()', (ctx) => {
        const objectRootClone = cloneDeep(objectRoot)
        const oldValue = setObjectPath(objectRootClone, [0, 'Hello World', 1, 'key'], 'replaced value')

        Assert.equal(oldValue, 'initial value')
        Assert.equal(objectRootClone[0]!['Hello World'][1].key, 'replaced value')
    })
})

import {areEqual, areEqualDeepSerializable, areEqualDeepStrict} from '@downforce/std/value'
import Assert from 'node:assert/strict'
import {describe, test} from 'node:test'

describe('@downforce/std/value', (ctx) => {
    test('areEqual()', (ctx) => {
        Assert.equal(areEqual(undefined, undefined), true)
        Assert.equal(areEqual(null, null), true)
        Assert.equal(areEqual(true, true), true)
        Assert.equal(areEqual(NaN, NaN), true)
        Assert.equal(areEqual(123, 123), true)
        Assert.equal(areEqual('abc', 'abc'), true)

        Assert.equal(areEqual({}, {}), false)
    })

    test('areEqualDeepStrict()', (ctx) => {
        const primitiveObject = {
            undefined: undefined,
            null: null,
            bool: true,
            nan: NaN,
            number: 123,
            string: 'abc',
        }

        {
            const actual = areEqualDeepStrict(
                {
                    ...primitiveObject,
                    date: new Date(0),
                    list: [
                        {...primitiveObject},
                        {...primitiveObject, list: [primitiveObject, primitiveObject]},
                    ],
                    object: {
                        ...primitiveObject,
                        list: [
                            {...primitiveObject},
                            {...primitiveObject, list: [primitiveObject, primitiveObject]},
                        ],
                    },
                },
                {
                    ...primitiveObject,
                    date: new Date(0),
                    list: [
                        {...primitiveObject},
                        {...primitiveObject, list: [primitiveObject, primitiveObject]},
                    ],
                    object: {
                        ...primitiveObject,
                        list: [
                            {...primitiveObject},
                            {...primitiveObject, list: [primitiveObject, primitiveObject]},
                        ],
                    },
                },
            )

            Assert.equal(actual, true)
        }
        {
            const actual = areEqualDeepStrict(
                {...primitiveObject},
                {...primitiveObject, prop: undefined},
            )

            Assert.equal(actual, false)
        }
        {
            const actual = areEqualDeepStrict(
                {
                    list: [
                        {list: [1, 2]},
                    ],
                },
                {
                    list: [
                        {list: [1, 2, 3]},
                    ],
                },
            )

            Assert.equal(actual, false)
        }
    })

    test('areEqualDeepSerializable()', (ctx) => {
        const data = {
            undefined: undefined,
            null: null,
            bool: true,
            nan: NaN,
            number: 123,
            string: 'abc',
            date: new Date(),
            object: {prop: {value: 'value'}},
            list: [{
                prop: {value: 'value'},
                list: [{prop: {value: 'value'}}],
            }],
        }

        {
            const actual = areEqualDeepSerializable({...data}, {...data})

            Assert.equal(actual, true)
        }

        {
            const actual = areEqualDeepSerializable({...data}, {...data, different: 0})

            Assert.equal(actual, false)
        }
    })
})

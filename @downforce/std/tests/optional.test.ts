import {isDefined, isSome, matchNone, matchOptional, matchSome} from '@downforce/std/optional'
import {expectType} from '@downforce/std/type'
import Assert from 'node:assert/strict'
import {describe, test} from 'node:test'

type Data = {id: number, name: string, age: number, admin: boolean, value: number}
const data: Data = {id: 1, name: 'Mario', age: 18, admin: false, value: 123}

describe('@downforce/std/optional', (ctx) => {
    test('isDefined()', (ctx) => {
        {
            const input = undefined as unknown

            if (isDefined(input)) {
                expectType<{}>(input)
            }
        }
        {
            const input = undefined as void | undefined | null | boolean | number | string

            if (isDefined(input)) {
                expectType<(arg: null | boolean | number | string) => null>((arg: typeof input) => null)

                expectType<null | boolean | number | string>(input)
                expectType<(null extends typeof input ? true : false)>(true)
                expectType<(boolean extends typeof input ? true : false)>(true)
                expectType<(number extends typeof input ? true : false)>(true)
                expectType<(string extends typeof input ? true : false)>(true)

                // @ts-expect-error
                expectType<(arg: undefined | null | boolean | number | string) => null>((arg: typeof input) => null)
                // @ts-expect-error
                expectType<(undefined extends typeof input ? true : false)>(true)
            }
        }
        {
            const input = [undefined, null, true, 123, 'abc'].filter(isDefined)

            expectType<Array<null | boolean | number | string>>(input)
        }
    })

    test('isSome()', (ctx) => {
        {
            const input = undefined as unknown

            if (isSome(input)) {
                expectType<{}>(input)
            }
        }
        {
            const input = undefined as void | undefined | null | boolean | number | string

            if (isSome(input)) {
                expectType<boolean | number | string>(input)
            }
        }
        {
            const input = [undefined, null, true, 123, 'abc'].filter(isSome)

            expectType<Array<boolean | number | string>>(input)
        }
    })

    test('matchOptional()', (ctx) => {
        {
            const expected = 123
            const actual: string | number = matchOptional(
                undefined as undefined | string,
                expectType<string>,
                () => expected,
            )

            Assert.equal(actual, expected)
        }
    })

    test('matchSome()', (ctx) => {
        {
            const actual: undefined | string = matchSome(undefined as undefined | string, expectType<string>)

            Assert.equal(actual, undefined)
        }

        {
            const actual: undefined | string = matchSome(undefined as undefined | number, it => String(it))

            Assert.equal(actual, undefined)
        }

        {
            const actual: undefined | {title: string} = matchSome(data.name as undefined | string, it => ({title: it}) )

            Assert.deepStrictEqual(actual, {title: data.name})
        }
    })

    test('matchNone()', (ctx) => {
        {
            const actual: undefined | number | string = matchNone(undefined as undefined | number, it => data.name)

            Assert.equal(actual, data.name)
        }
    })
})

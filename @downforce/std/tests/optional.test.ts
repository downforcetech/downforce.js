import {returningValue} from '@downforce/std/fn'
import {isSome, whenNone, whenOptional, whenSome} from '@downforce/std/optional'
import {expectType} from '@downforce/std/type'
import Assert from 'node:assert'
import {describe, test} from 'node:test'

export type Subject = {id: number, name: string, age: number, admin: boolean}
export const subject: Subject = {id: 1, name: 'Mario', age: 18, admin: false}

describe('@downforce/std/optional', (ctx) => {
    test('isSome()', (ctx) => {
        {
            const input = undefined as unknown

            if (isSome(input)) {
                expectType<{}>(input)
            }
        }
        {
            const input = undefined as  undefined | boolean | number | string

            if (isSome(input)) {
                expectType<boolean | boolean | number | string>(input)
            }
        }
        {
            const input = [undefined, null, true, 123, 'string'].filter(isSome)

            expectType<Array<boolean | boolean | number | string>>(input)
        }
    })

    test('whenOptional()', (ctx) => {
        {
            const expected = 123
            const actual = whenOptional(
                undefined as undefined | string,
                expectType<string>,
                returningValue(expected),
            )

            expectType<string | number>(actual)
            Assert.strictEqual(actual, expected)
        }
    })

    test('whenSome()', (ctx) => {
        {
            const actual = whenSome(undefined as undefined | string, expectType<string>)

            expectType<undefined | string>(actual)
            Assert.strictEqual(actual, undefined)
        }

        {
            const actual = whenSome(undefined as undefined | number, it => String(it))

            expectType<undefined | string>(actual)
            Assert.strictEqual(actual, undefined)
        }

        {
            const actual = whenSome(subject.name as undefined | string, it => ({title: it}) )

            expectType<undefined | {title: string}>(actual)
            Assert.deepStrictEqual(actual, {title: subject.name})
        }
    })

    test('whenNone()', (ctx) => {
        {
            const actual = whenNone(undefined as undefined | number, it => subject.name)

            expectType<undefined | number | string>(actual)
            Assert.strictEqual(actual, subject.name)
        }
    })
})

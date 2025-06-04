import {isSome, mapNone, mapSome} from '@downforce/std/optional'
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

    test('mapSome()', (ctx) => {
        {
            const result = mapSome(undefined as undefined | number, it => String(it))

            expectType<undefined | string>(result)
            Assert.strictEqual(result, undefined)
        }

        {
            const result = mapSome(subject.name as undefined | string, it => ({title: it}) )

            expectType<undefined | {title: string}>(result)
            Assert.deepStrictEqual(result, {title: subject.name})
        }
    })

    test('mapNone()', (ctx) => {
        {
            const result = mapNone(undefined as undefined | number, it => subject.name)

            expectType<undefined | number | string>(result)
            Assert.strictEqual(result, subject.name)
        }
    })
})

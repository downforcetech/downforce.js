import {arrayWrap} from '@downforce/std/array'
import {expectType, TypeAssert, TypeEnsure, TypeStrict} from '@downforce/std/type'
import Assert from 'node:assert'
import {describe, test} from 'node:test'

describe('@downforce/std/type TypeAssert', (ctx) => {
    test('TypeAssert.assertEnum()', (ctx) => {
        const enumList = ['A' as const, 'B' as const]

        {
            const input: undefined | 'A' = 'A'
            TypeAssert.assertEnum(input, enumList as Array<'A' | 'B'>)
            expectType<'A'>(input)
        }
        {
            const input: undefined | 'A' = 'A'
            TypeAssert.assertEnum(input, enumList as ['A', 'B'])
            expectType<'A'>(input)
        }
        {
            const input: undefined | 'A' = 'A'
            TypeAssert.assertEnum(input, enumList as unknown as (readonly ['A', 'B']))
            expectType<'A'>(input)
        }

        Assert.throws(() => {
            TypeAssert.assertEnum('X', enumList)
        })
    })
})

describe('@downforce/std/type TypeEnsure', (ctx) => {
    test('TypeEnsure.ensureEnum()', (ctx) => {
        const enumList = ['A' as const, 'B' as const]
        const input: undefined | 'A' = 'A'

        {
            Assert.strictEqual(
                expectType<'A'>(TypeEnsure.ensureEnum(input, enumList as Array<'A' | 'B'>)),
                enumList[0],
            )
        }
        {
            Assert.strictEqual(
                expectType<'A'>(TypeEnsure.ensureEnum(input, enumList as ['A', 'B'])),
                enumList[0],
            )
        }
        {
            Assert.strictEqual(
                expectType<'A'>(TypeEnsure.ensureEnum(input, enumList as unknown as (readonly ['A', 'B']))),
                enumList[0],
            )
        }

        Assert.throws(() => {
            TypeEnsure.ensureEnum('X', enumList)
        })
    })

    test('TypeEnsure.ensureObject()', (ctx) => {
        interface Input {hello: string}
        {
            const input: undefined | Input = {hello: 'world'}

            Assert.deepStrictEqual(
                expectType<Input>(TypeEnsure.ensureObject(input)),
                input,
            )
        }
        {
            const input: unknown = undefined

            Assert.throws(() => {
                expectType<Record<PropertyKey, unknown>>(TypeEnsure.ensureObject(input))
            })
        }
    })
})

describe('@downforce/std/type TypeStrict', (ctx) => {
    test('tryArray()', (ctx) => {
        expectType<undefined | [number]>(TypeStrict.strictArray([] as unknown as [number]))
        expectType<undefined | number[]>(TypeStrict.strictArray([] as unknown as number[]))
        expectType<undefined | Array<number>>(TypeStrict.strictArray([] as unknown as Array<number>))
        expectType<undefined | readonly [number]>(TypeStrict.strictArray([] as unknown as readonly [number]))
        expectType<undefined | readonly number[]>(TypeStrict.strictArray([] as unknown as readonly number[]))
        expectType<undefined | ReadonlyArray<number>>(TypeStrict.strictArray([] as unknown as ReadonlyArray<number>))
        expectType<undefined | [number, string]>(TypeStrict.strictArray([] as unknown as [number, string]))
        expectType<undefined | Array<number|string>>(TypeStrict.strictArray([] as unknown as [number, string]))
    })
})

describe('@downforce/std/array', (ctx) => {
    test('arrayWrap()', (ctx) => {
        expectType<[number]>(arrayWrap([] as unknown as (number | [number])))
        expectType<number[]>(arrayWrap([] as unknown as (number | number[])))
        expectType<Array<number>>(arrayWrap([] as unknown as (number | Array<number>)))
        expectType<readonly [number]>(arrayWrap([] as unknown as (number | readonly [number])))
        expectType<readonly number[]>(arrayWrap([] as unknown as (number | readonly number[])))
        expectType<ReadonlyArray<number>>(arrayWrap([] as unknown as (number | ReadonlyArray<number>)))
        expectType<[number] | [number, string]>(arrayWrap([] as unknown as (number | [number, string])))
        expectType<Array<number> | Array<number|string>>(arrayWrap([] as unknown as (number | Array<number|string>)))
        expectType<[number, ...Array<unknown>]>(arrayWrap([] as unknown as (number | [number, string])))
    })
})

// export function tryArray<V, I>(value: V | I):
//     V extends Array<infer I> ? // [T] | T[] | Array<T>
//         number extends V['length'] ?
//             'T[] | Array<T>' | I// T[] | Array<T>
//         : '[T]' // [T]
//     : V extends readonly (infer I)[] ? // readonly T[] | readonly [T] | ReadonlyArray<T>
//         number extends V['length'] ?
//             'readonly T[] | ReadonlyArray<T>' // readonly T[] | ReadonlyArray<T>
//         : 'readonly [T]' // readonly [T]
//     : 'T' // T
// export function tryArray<V, T extends unknown[]>(value: V | [...T]): [V] | [...T]
// export function tryArray<V, T extends unknown[]>(value: V | readonly [...T]): [V] | readonly [...T]
// export function tryArray<V, I>(value: V | readonly I[]): [V] | readonly I[]
// export function tryArray<V, I>(value: V | I[]): V[] | I[]

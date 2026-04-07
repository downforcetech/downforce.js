import {expectType, TypeAssert, TypeEnsure, TypeStrict} from '@downforce/std/type'
import Assert from 'node:assert/strict'
import {describe, test} from 'node:test'

describe('@downforce/std/type', (ctx) => {
    test('expectType()', (ctx) => {
        expectType<undefined | null | number | string>(undefined as | undefined | null | number | string)
        // @ts-expect-error
        expectType<number | string>(undefined as | undefined | null | number | string)
        // @off-ts-expect-error
        expectType<undefined | null | number | string>(undefined as | undefined | null)
    })

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

    test('TypeEnsure.ensureEnum()', (ctx) => {
        const enumList = ['A' as const, 'B' as const]
        const input: undefined | 'A' = 'A'

        {
            Assert.equal(
                expectType<'A'>(TypeEnsure.ensureEnum(input, enumList as Array<'A' | 'B'>)),
                enumList[0],
            )
        }
        {
            Assert.equal(
                expectType<'A'>(TypeEnsure.ensureEnum(input, enumList as ['A', 'B'])),
                enumList[0],
            )
        }
        {
            Assert.equal(
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

            Assert.deepEqual(
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

    test('TypeStrict.strictArray()', (ctx) => {
        expectType<undefined | [number]>(TypeStrict.strictArray([] as unknown as [number]))
        expectType<undefined | number[]>(TypeStrict.strictArray([] as unknown as number[]))
        expectType<undefined | Array<number>>(TypeStrict.strictArray([] as unknown as Array<number>))
        expectType<undefined | readonly [number]>(TypeStrict.strictArray([] as unknown as readonly [number]))
        expectType<undefined | readonly number[]>(TypeStrict.strictArray([] as unknown as readonly number[]))
        expectType<undefined | ReadonlyArray<number>>(TypeStrict.strictArray([] as unknown as ReadonlyArray<number>))
        expectType<undefined | [number, string]>(TypeStrict.strictArray([] as unknown as [number, string]))
        expectType<undefined | Array<number|string>>(TypeStrict.strictArray([] as unknown as [number, string]))
    })

    test('TypeStrict.strictEnum()', (ctx) => {
        const AbcEnumType = {
            A: 'A' as const,
            B: 'B' as const,
        }
        const AbcEnumList = Object.values(AbcEnumType)
        type AbcEnumType = typeof AbcEnumList[number]

        const string: string = 'abc'
        const stringOptional: undefined | string = 'abc'
        const stringAbc: AbcEnumType = 'A'
        const stringAbcOptional: undefined | AbcEnumType = 'A'

        expectType<undefined | AbcEnumType>(TypeStrict.strictEnum(string, ['A', 'B']))
        expectType<undefined | AbcEnumType>(TypeStrict.strictEnum(stringOptional, AbcEnumList))
        expectType<undefined | AbcEnumType>(TypeStrict.strictEnum(stringAbc, AbcEnumList))
        expectType<undefined | AbcEnumType>(TypeStrict.strictEnum(stringAbcOptional, AbcEnumList))
    })
})

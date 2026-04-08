import {mapArray, matchArray, splitArray} from '@downforce/std/array'
import {matchBoolean} from '@downforce/std/boolean'
import {matchDate} from '@downforce/std/date'
import {$_, _pipe, _tryCatch, chain, identity, matchFunction, pipe, piped, returnUndefined} from '@downforce/std/fn'
import {matchNumber} from '@downforce/std/number'
import {matchObject} from '@downforce/std/object'
import {ensureSome, ensureUndefined, matchNone, matchNull, matchOptional, matchSome, matchUndefined, type None} from '@downforce/std/optional'
import {catchPromiseError, createError, matchError, matchOutcome, matchResult, type OutcomeError} from '@downforce/std/outcome'
import {awaitPromise, catchPromise, matchPromise, thenPromise} from '@downforce/std/promise'
import {matchRegExp} from '@downforce/std/regexp'
import {ensureStringNotEmpty, matchString} from '@downforce/std/string'
import {matchSymbol} from '@downforce/std/symbol'
import {expectType} from '@downforce/std/type'
import Assert from 'node:assert/strict'
import {describe, test} from 'node:test'

type Data = {id: number, name: string, age: number, admin: boolean, value: number}
const data: Data = {id: 1, name: 'Mario', age: 18, admin: false, value: 123}

describe('@downforce/std/fn', (ctx) => {
    test('Partial Application: *($_) and _*()', async (ctx) => {
        {
            const actual: string = pipe(
                $_,
                (it: Data) => it,
                it => it.value,
                String,
            )(data)

            Assert.equal(actual, '123')
        }
        {
            const actual: string = _pipe(
                (it: Data) => it,
                it => it.value,
                String,
            )(data)

            Assert.equal(actual, '123')
        }
        {
            const actual: string | OutcomeError<'NoValue' | 'Boom'> = piped(undefined as undefined | string)
                (ensureUndefined)
                (matchNone($_, it => ['hello', undefined, 'world']))
                (matchSome($_, expectType<Array<undefined | string>>))
                (matchSome($_, (it: Array<undefined | string>) => it))
                // @ts-expect-error
                (matchSome($_, (it: Array<string>) => it))
                (matchOptional($_, (it: Array<string>) => it, (it: None) => undefined))
                (matchSome($_, (it: Array<string>) => it))
                (matchNone($_, (it: None) => undefined))
                (chain($_, expectType<undefined | Array<string>>))
                (matchSome($_, mapArray($_, (it, idx) => idx)))
                (expectType<undefined | Array<number>>)
                (matchSome($_, splitArray($_, (it, idx) => idx % 2 === 0)))
                (matchOptional($_, it => data, returnUndefined))
                (ensureSome)
                (expectType<Data>)
                (chain($_, expectType<Data>))
                (matchSome($_, it => it.age >= 18 ? it : undefined))
                (matchNone($_, () => createError('NoValue')))
                (expectType<Data| OutcomeError<'NoValue'>>)
                (matchOutcome($_, expectType<Data>, createError))
                (expectType<Data| OutcomeError<'NoValue'>>)
                (_tryCatch(
                    matchResult(
                        $_,
                        it => (ensureStringNotEmpty(it.name), it),
                    ),
                    error => createError('Boom'),
                ))
                (expectType<Data| OutcomeError<'NoValue'> | OutcomeError<'Boom'>>)
                (matchResult($_, expectType<Data>))
                (expectType<Data| OutcomeError<'NoValue'> | OutcomeError<'Boom'>>)
                (matchError($_, createError))
                (identity)
                (expectType<Data | OutcomeError<'NoValue'> | OutcomeError<'Boom'>>)
                (expectType<Data | OutcomeError<'NoValue' | 'Boom'>>)
                (chain($_, expectType<Data | OutcomeError<'NoValue'> | OutcomeError<'Boom'>>))
                (matchResult($_, it => String(it.value)))
            ()

            Assert.equal(actual, '123')
        }
        {
            const actual: Data | OutcomeError<'SomeError'> | OutcomeError<'OtherError'> = await piped(Promise.resolve(data))
                (awaitPromise($_, identity, createError))
                (expectType<Promise<Data | OutcomeError<unknown>>>)
                (thenPromise($_, expectType<Data | OutcomeError<unknown>>))
                (expectType<Promise<Data | OutcomeError<unknown>>>)
                (catchPromise($_, createError))
                (catchPromiseError($_)) // Same of _catchPromise(createError).
                (thenPromise($_, matchResult($_, expectType<Data>)))
                (thenPromise($_, matchError($_, error => createError('SomeError'))))
                (catchPromiseError($_, 'OtherError'))
                (expectType<Promise<Data | OutcomeError<'SomeError'> | OutcomeError<'OtherError'>>>)
            ()

            Assert.deepEqual(actual, data)
        }
        {
            type InputType = void | undefined | null | boolean | 123 | 'ABC' | Date | RegExp | symbol | Promise<'ABC'> | Record<string, string> | Array<'ABC'> | OutcomeError<'ABC'>
            const actual: undefined = piped(undefined as InputType)
                (matchArray($_, it => void expectType<Array<'ABC'>>(it)))
                (matchArray($_, it => void expectType<never>(it), it => it))
                (matchBoolean($_, it => void expectType<boolean>(it)))
                (matchBoolean($_, it => void expectType<never>(it), it => it))
                (matchDate($_, it => void expectType<Date>(it)))
                (matchDate($_, it => void expectType<never>(it), it => it))
                (matchError($_, it => void expectType<OutcomeError<'ABC'>['error']>(it)))
                (matchError($_, it => void expectType<never>(it), it => it))
                (matchFunction($_, it => void expectType<Function>(it)))
                (matchFunction($_, it => void expectType<never>(it), it => it))
                (matchNull($_, it => void expectType<null>(it)))
                (matchNull($_, it => void expectType<never>(it), it => it))
                (matchNumber($_, it => void expectType<123>(it)))
                (matchNumber($_, it => void expectType<never>(it), it => it))
                (matchObject($_, it => void expectType<Record<PropertyKey, unknown>>(it)))
                (matchObject($_, it => void expectType<never>(it), it => it))
                (matchPromise($_, it => void expectType<Promise<unknown>>(it)))
                (matchPromise($_, it => void expectType<never>(it), it => it))
                (matchRegExp($_, it => void expectType<RegExp>(it)))
                (matchRegExp($_, it => void expectType<never>(it), it => it))
                (matchString($_, it => void expectType<'ABC'>(it)))
                (matchString($_, it => void expectType<never>(it), it => it))
                (matchSymbol($_, it => void expectType<symbol>(it)))
                (matchSymbol($_, it => void expectType<never>(it), it => it))
                (matchUndefined($_, it => void expectType<undefined>(it)))
                (matchUndefined($_, it => void expectType<undefined>(it), it => it))
                (expectType<undefined>)
                (matchSome($_, it => void expectType<never>(it)))
            ()
        }
        {
            const actual: unknown = piped(undefined as unknown)
                (matchArray($_, it => void expectType<Array<unknown>>(it)))
                (matchBoolean($_, it => void expectType<boolean>(it)))
                (matchDate($_, it => void expectType<Date>(it)))
                (matchError($_, it => void expectType<OutcomeError<unknown>['error']>(it)))
                (matchFunction($_, it => void expectType<Function>(it)))
                (matchNull($_, it => void expectType<null>(it)))
                (matchNumber($_, it => void expectType<number>(it)))
                (matchObject($_, it => void expectType<Record<PropertyKey, unknown>>(it)))
                (matchPromise($_, it => void expectType<Promise<unknown>>(it)))
                (matchRegExp($_, it => void expectType<RegExp>(it)))
                (matchString($_, it => void expectType<string>(it)))
                (matchSymbol($_, it => void expectType<symbol>(it)))
                (matchUndefined($_, it => void expectType<undefined>(it)))
                (matchSome($_, it => void expectType<{}>(it)))
            ()
        }
    })
})

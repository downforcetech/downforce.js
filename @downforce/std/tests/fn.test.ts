import {chain, chaining, compose, composed, identity, pipe, piped, pipedLazy, tryingCatching} from '@downforce/std/fn'
import {matchingNone, matchingOptional, matchingSome} from '@downforce/std/optional'
import {Error, matchingError, matchingResult, matchingResultOrError, type OutcomeError} from '@downforce/std/outcome'
import {awaiting, catching, catchingError} from '@downforce/std/promise'
import {ensureStringNotEmpty} from '@downforce/std/string'
import {expectType} from '@downforce/std/type'
import Assert from 'node:assert'
import {describe, test} from 'node:test'

export type Subject = {id: number, name: string, age: number, admin: boolean}
export const subject: Subject = {id: 1, name: 'Mario', age: 18, admin: false}

describe('@downforce/std/fn', (ctx) => {
    test('chain()', (ctx) => {
        {
            const actual = chain(
                subject,
                it => it.id,
                it => it.name,
            )

            expectType<Subject>(actual)
            Assert.strictEqual(actual, subject)
        }
    })

    type State = {example: number}
    const state: State = {example: 123}

    test('compose()', (ctx) => {
        const fn = compose(
            (it: State) => it.example,
            it => String(it),
            identity,
        )

        expectType<string>(fn(state))
        Assert.strictEqual(fn(state), '123')
    })

    test('composed()', (ctx) => {
        const fn = composed
            ((it: State) => it.example)
            (it => String(it))
            (identity)
        ()

        expectType<string>(fn(state))
        Assert.strictEqual(fn(state), '123')
    })

    test('pipe()', async (ctx) => {
        {
            const actual: Subject = pipe(subject)

            Assert.strictEqual(actual, subject)
        }

        {
            const actual = pipe(
                /* in */ 0 as const,
                /*  1 */ it => it + 1 as 1,
                /*  2 */ it => it + 2 as 3,
                /*  3 */ it => it + 3 as 6,
                /*  4 */ it => it + 4 as 10,
                /*  5 */ it => it + 5 as 15,
                /*  6 */ it => it + 6 as 21,
                /*  7 */ it => it + 7 as 28,
                /*  8 */ it => it + 8 as 36,
                /*  9 */ it => it + 9 as 45,
                /* 10 */ it => it + 10 as 55,
            )

            expectType<55>(actual)
            Assert.strictEqual(actual, 55)
        }

        {
            const actual = pipe(
                subject,
                it => it.name,
                it => `Hello ${it}!`,
            )

            expectType<string>(actual)
            Assert.strictEqual(actual, `Hello ${subject.name}!`)
        }
    })

    test('pipedLazy()', (ctx) => {
        {
            const actual: Subject = pipedLazy(subject)
                .to(identity)
                .to(identity)
            .end

            Assert.strictEqual(actual, subject)
        }
    })

    test('piped()', async (ctx) => {
        {
            const actual: Subject = piped(subject)()

            Assert.strictEqual(actual, subject)
        }

        {
            const actual: string = piped(subject)
                (it => it.name)
                (it => `Hello ${it}!`)
            ()

            Assert.strictEqual(actual, `Hello ${subject.name}!`)
        }

        {
            const actual: Subject | OutcomeError<'VeryTooYoung' | 'Boom'> = piped(undefined as undefined | string)
                (matchingSome((it: string) => it))
                (chaining(expectType<undefined | string>))
                (matchingSome(it => ({...subject, name: `Some ${it}`})))
                (matchingNone(it => subject))
                (matchingOptional(it => it, it => subject))
                (chaining(expectType<Subject>))
                (it => it.age >= 18 ? it : Error('TooYoung'))
                (matchingResultOrError(identity, Error))
                (matchingResultOrError(
                    it => (expectType<Subject>(it), ensureStringNotEmpty(it.name), it),
                    error => (expectType<string>(error), Error(`Very${ensureStringNotEmpty(error)}`)),
                ))
                (tryingCatching(
                    matchingResult(
                        it => (ensureStringNotEmpty(it.name), it),
                    ),
                    error => Error('Boom'),
                ))
                // (mappingResult(
                //     tringCatching(
                //         it => (ensureStringNotEmpty(it.name), it),
                //         error => Error('Boom'),
                //     ),
                // ))
                (matchingResultOrError(
                    it => expectType<Subject>(it),
                    error => Error(expectType<'VeryTooYoung' | 'Boom'>(error)),
                ))
                (matchingResult(it => it))
                (matchingError(error => Error(error)))
                (identity)
                (expectType<Subject | OutcomeError<'VeryTooYoung' | 'Boom'>>)
                (chaining(it => expectType<Subject | OutcomeError<'VeryTooYoung' | 'Boom'>>(it)))
            ()

            Assert.strictEqual(actual, subject)
        }

        {
            const actual: Subject | OutcomeError<'SomeError'> = await piped(Promise.resolve(subject))
                (awaiting(identity, Error))
                (awaiting(identity))
                (awaiting(identity, Error))
                (expectType<Promise<Subject | OutcomeError<unknown>>>)
                (awaiting(expectType<Subject | OutcomeError<unknown>>))
                (catching(Error))
                (catchingError()) // Same of catching(Error).
                (catchingError('Error'))
                (awaiting(matchingResult(identity)))
                (awaiting(matchingError(error => Error('SomeError' as const))))
            ()

            Assert.deepStrictEqual(actual, subject)
        }

        {
            const actual: undefined | Array<string> = piped(undefined as undefined | Array<undefined | string>)
                (matchingSome(expectType<Array<undefined | string>>))
                // @ts-expect-error
                (matchingSome((it: Array<string>) => it))
            ()
        }
    })
})

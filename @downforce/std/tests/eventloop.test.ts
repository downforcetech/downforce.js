import {scheduleMacroTaskUsingTimeout, scheduleMicroTask, scheduleMicroTaskUsingPromise} from '@downforce/std/eventloop'
import Assert from 'node:assert'
import {describe, test} from 'node:test'

describe('@downforce/std/eventloop', (ctx) => {
    test('schedule{Micro,Marco}TaskUsing*()', async (ctx) => {
        const results: Array<string> = []

        await Promise.all([
            new Promise<void>(resolve => scheduleMicroTask(() => { results.push('MICRO scheduleMicroTask 1'); resolve() })),
            new Promise<void>(resolve => scheduleMicroTaskUsingPromise(() => { results.push('MICRO scheduleMicroTaskUsingPromise 1'); resolve() })),
            new Promise<void>(resolve => scheduleMacroTaskUsingTimeout(() => { results.push('MACRO scheduleMacroTaskUsingTimeout 1'); resolve() })),

            new Promise<void>(resolve => scheduleMicroTask(() => { results.push('MICRO scheduleMicroTask 2'); resolve() })),
            new Promise<void>(resolve => scheduleMicroTaskUsingPromise(() => { results.push('MICRO scheduleMicroTaskUsingPromise 2'); resolve() })),
            new Promise<void>(resolve => scheduleMacroTaskUsingTimeout(() => { results.push('MACRO scheduleMacroTaskUsingTimeout 2'); resolve() })),
        ])

        Assert.deepStrictEqual(results, [
            'MICRO scheduleMicroTask 1',
            'MICRO scheduleMicroTaskUsingPromise 1',
            'MICRO scheduleMicroTask 2',
            'MICRO scheduleMicroTaskUsingPromise 2',

            'MACRO scheduleMacroTaskUsingTimeout 1',
            'MACRO scheduleMacroTaskUsingTimeout 2',
        ])
    })
})

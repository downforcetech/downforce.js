import {joinUrlPaths} from '@downforce/web/url'
import Assert from 'node:assert/strict'
import {describe, test} from 'node:test'

const PathPartsTests: Array<[string, [string, string, ...Array<string>]]> = [
    ['/api', ['', 'api']],
    ['/api', ['', '/api']],
    ['/api/', ['/', 'api/']],
    ['/api/', ['/', '/api/']],
    ['api/v1', ['api', 'v1']],
    ['/api/v1', ['/api', 'v1']],
    ['/api/v1', ['/api', '/v1']],
    ['/api/v1', ['/api/', '/v1']],
    ['/api/v1/id/', ['/api/', '/v1/', '/id/']],
    ['https://api.com/api', ['https://api.com', 'api']],
    ['https://api.com/api', ['https://api.com/', 'api']],
    ['https://api.com/api', ['https://api.com', '/api']],
    ['https://api.com/api', ['https://api.com/', '/api']],
    ['https://api.com/api/v2', ['https://api.com', '/api/', 'v2']],
]

describe('@downforce/web/url', (ctx) => {
    test('joinUrlPaths()', async (ctx) => {
        for (const it of PathPartsTests) {
            const [expected, args] = it
            const actual = joinUrlPaths(...args)
            Assert.equal(expected, actual)
        }
    })
})

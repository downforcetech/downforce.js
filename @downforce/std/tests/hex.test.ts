import {decodeStringFromHex, encodeStringToHex} from '@downforce/std/hex'
import Assert from 'node:assert'
import {describe, test} from 'node:test'

const data = {
    case1: {
        decodedString: '[abcd 😀 123]',
        encodedHex: '5b6162636420f09f9880203132335d',
    },
    case2: {
        decodedString: '[abcd 😀 1234]',
        encodedHex: '5b6162636420f09f988020313233345d',
    },
}

describe('@downforce/std/hex', (ctx) => {
    test('encodeStringToHex()', (ctx) => {
        Assert.strictEqual(encodeStringToHex(data.case1.decodedString), data.case1.encodedHex)
        Assert.strictEqual(encodeStringToHex(data.case2.decodedString), data.case2.encodedHex)
    })

    test('decodeStringFromHex()', (ctx) => {
        Assert.strictEqual(decodeStringFromHex(data.case1.encodedHex), data.case1.decodedString)
        Assert.strictEqual(decodeStringFromHex(data.case2.encodedHex), data.case2.decodedString)
    })
})

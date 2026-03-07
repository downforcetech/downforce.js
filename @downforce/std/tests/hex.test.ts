import {decodeStringFromHex, encodeStringToHex} from '@downforce/std/hex'
import Assert from 'node:assert/strict'
import {describe, test} from 'node:test'

const HexDataTests = {
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
        Assert.equal(encodeStringToHex(HexDataTests.case1.decodedString), HexDataTests.case1.encodedHex)
        Assert.equal(encodeStringToHex(HexDataTests.case2.decodedString), HexDataTests.case2.encodedHex)
    })

    test('decodeStringFromHex()', (ctx) => {
        Assert.equal(decodeStringFromHex(HexDataTests.case1.encodedHex), HexDataTests.case1.decodedString)
        Assert.equal(decodeStringFromHex(HexDataTests.case2.encodedHex), HexDataTests.case2.decodedString)
    })
})

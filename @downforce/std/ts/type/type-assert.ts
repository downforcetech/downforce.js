import {assertArray} from '../array/array-assert.js'
import {assert} from '../assert.js'
import {assertBoolean} from '../boolean/boolean-assert.js'
import {assertDate, assertDateString} from '../date/date-assert.js'
import {assertEnum} from '../enum/enum-assert.js'
import {assertFunction} from '../fn/fn-assert.js'
import {assertInteger, assertNumber} from '../number/number-assert.js'
import {assertObject} from '../object/object-assert.js'
import {assertDefined, assertSome, assertUndefined} from '../optional/optional-assert.js'
import {assertPromise} from '../promise/promise-assert.js'
import {assertString} from '../string/string-assert.js'

export const TypeAssert: {
    assert: typeof assert
    assertArray: typeof assertArray
    assertBoolean: typeof assertBoolean
    assertDate: typeof assertDate
    assertDateString: typeof assertDateString
    assertDefined: typeof assertDefined
    assertEnum: typeof assertEnum
    assertFunction: typeof assertFunction
    assertInteger: typeof assertInteger
    assertNumber: typeof assertNumber
    assertObject: typeof assertObject
    assertPromise: typeof assertPromise
    assertSome: typeof assertSome
    assertString: typeof assertString
    assertUndefined: typeof assertUndefined
} = {
    assert: assert,
    assertArray: assertArray,
    assertBoolean: assertBoolean,
    assertDate: assertDate,
    assertDateString: assertDateString,
    assertDefined: assertDefined,
    assertEnum: assertEnum,
    assertFunction: assertFunction,
    assertInteger: assertInteger,
    assertNumber: assertNumber,
    assertObject: assertObject,
    assertPromise: assertPromise,
    assertSome: assertSome,
    assertString: assertString,
    assertUndefined: assertUndefined,
}

import {isArray} from '../array/array-is.js'
import {isBoolean} from '../boolean/boolean-is.js'
import {isDate} from '../date/date-is.js'
import {isEnum} from '../enum/enum-is.js'
import {isFunction} from '../fn/fn-is.js'
import {isIterator} from '../iter/iter-is.js'
import {isInteger, isNumber} from '../number/number-is.js'
import {isObject} from '../object/object-is.js'
import {isDefined, isNone, isNull, isSome, isUndefined} from '../optional/optional-is.js'
import {isPromise, isPromiseSettledFulfilled, isPromiseSettledRejected} from '../promise/promise-is.js'
import {isRegExp} from '../regexp/regexp-is.js'
import {isError, isResult} from '../outcome/outcome-is.js'
import {isString} from '../string/string-is.js'
import {isSymbol} from '../symbol/symbol-is.js'

export const TypeIs: {
    isArray: typeof isArray
    isBoolean: typeof isBoolean
    isDate: typeof isDate
    isDefined: typeof isDefined
    isEnum: typeof isEnum
    isError: typeof isError
    isFunction: typeof isFunction
    isInteger: typeof isInteger
    isIterator: typeof isIterator
    isNone: typeof isNone
    isNull: typeof isNull
    isNumber: typeof isNumber
    isObject: typeof isObject
    isPromise: typeof isPromise
    isPromiseSettledFulfilled: typeof isPromiseSettledFulfilled
    isPromiseSettledRejected: typeof isPromiseSettledRejected
    isRegExp: typeof isRegExp
    isResult: typeof isResult
    isSome: typeof isSome
    isString: typeof isString
    isSymbol: typeof isSymbol
    isUndefined: typeof isUndefined
} = {
    isArray: isArray,
    isBoolean: isBoolean,
    isDate: isDate,
    isDefined: isDefined,
    isEnum: isEnum,
    isError: isError,
    isFunction: isFunction,
    isInteger: isInteger,
    isIterator: isIterator,
    isNone: isNone,
    isNull: isNull,
    isNumber: isNumber,
    isObject: isObject,
    isPromise: isPromise,
    isPromiseSettledFulfilled: isPromiseSettledFulfilled,
    isPromiseSettledRejected: isPromiseSettledRejected,
    isRegExp: isRegExp,
    isResult: isResult,
    isSome: isSome,
    isString: isString,
    isSymbol: isSymbol,
    isUndefined: isUndefined,
}

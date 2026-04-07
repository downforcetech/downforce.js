import {matchArray} from '../array/array-match.js'
import {matchBoolean} from '../boolean/boolean-match.js'
import {matchDate} from '../date/date-match.js'
import {matchFunction} from '../fn/fn-match.js'
import {matchNumber} from '../number/number-match.js'
import {matchObject} from '../object/object-match.js'
import {matchNone, matchNull, matchOptional, matchSome, matchUndefined} from '../optional/optional-match.js'
import {matchError, matchOutcome, matchResult} from '../outcome/outcome-match.js'
import {matchPromise} from '../promise/promise-match.js'
import {matchRegExp} from '../regexp/regexp-match.js'
import {matchString} from '../string/string-match.js'
import {matchSymbol} from '../symbol/symbol-match.js'
// import {matchIterator} from '../iter/iter-match.js'
// import {matchPrimitive} from '../primitive/primitive-match.js'

export const TypeMatch: {
    // matchIterator: typeof matchIterator
    // matchPrimitive: typeof matchPrimitive
    matchArray: typeof matchArray
    matchBoolean: typeof matchBoolean
    matchDate: typeof matchDate
    matchError: typeof matchError
    matchFunction: typeof matchFunction
    matchNone: typeof matchNone
    matchNull: typeof matchNull
    matchNumber: typeof matchNumber
    matchObject: typeof matchObject
    matchOptional: typeof matchOptional
    matchOutcome: typeof matchOutcome
    matchPromise: typeof matchPromise
    matchRegExp: typeof matchRegExp
    matchResult: typeof matchResult
    matchSome: typeof matchSome
    matchString: typeof matchString
    matchSymbol: typeof matchSymbol
    matchUndefined: typeof matchUndefined
} = {
    // matchIterator: matchIterator,
    // matchPrimitive: matchPrimitive,
    matchArray: matchArray,
    matchBoolean: matchBoolean,
    matchDate: matchDate,
    matchError: matchError,
    matchFunction: matchFunction,
    matchNone: matchNone,
    matchNull: matchNull,
    matchNumber: matchNumber,
    matchObject: matchObject,
    matchOptional: matchOptional,
    matchOutcome: matchOutcome,
    matchPromise: matchPromise,
    matchRegExp: matchRegExp,
    matchResult: matchResult,
    matchSome: matchSome,
    matchString: matchString,
    matchSymbol: matchSymbol,
    matchUndefined: matchUndefined,
}

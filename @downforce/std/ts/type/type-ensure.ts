import {ensureArray} from '../array/array-ensure.js'
import {ensureBoolean} from '../boolean/boolean-ensure.js'
import {ensureDate, ensureDateString} from '../date/date-ensure.js'
import {ensureEnum} from '../enum/enum-ensure.js'
import {ensureFunction} from '../fn/fn-ensure.js'
import {ensureInteger, ensureNumber} from '../number/number-ensure.js'
import {ensureObject} from '../object/object-ensure.js'
import {ensureDefined, ensureSome, ensureUndefined} from '../optional/optional-ensure.js'
import {ensurePromise} from '../promise/promise-ensure.js'
import {ensureString} from '../string/string-ensure.js'

export const TypeEnsure: {
    ensureArray: typeof ensureArray
    ensureBoolean: typeof ensureBoolean
    ensureDate: typeof ensureDate
    ensureDateString: typeof ensureDateString
    ensureDefined: typeof ensureDefined
    ensureEnum: typeof ensureEnum
    ensureFunction: typeof ensureFunction
    ensureInteger: typeof ensureInteger
    ensureNumber: typeof ensureNumber
    ensureObject: typeof ensureObject
    ensurePromise: typeof ensurePromise
    ensureSome: typeof ensureSome
    ensureString: typeof ensureString
    ensureUndefined: typeof ensureUndefined
} = {
    ensureArray: ensureArray,
    ensureBoolean: ensureBoolean,
    ensureDate: ensureDate,
    ensureDateString: ensureDateString,
    ensureDefined: ensureDefined,
    ensureEnum: ensureEnum,
    ensureFunction: ensureFunction,
    ensureInteger: ensureInteger,
    ensureNumber: ensureNumber,
    ensureObject: ensureObject,
    ensurePromise: ensurePromise,
    ensureSome: ensureSome,
    ensureString: ensureString,
    ensureUndefined: ensureUndefined,
}

import {strictArray} from '../array/array-strict.js'
import {strictBoolean, strictBooleanLike} from '../boolean/boolean-strict.js'
import {strictDate} from '../date/date-strict.js'
import {strictEnum} from '../enum/enum-strict.js'
import {strictInteger, strictNumber} from '../number/number-strict.js'
import {strictObject} from '../object/object-strict.js'

export const TypeStrict: {
    strictArray: typeof strictArray
    strictBoolean: typeof strictBoolean
    strictBooleanLike: typeof strictBooleanLike
    strictDate: typeof strictDate
    strictEnum: typeof strictEnum
    strictInteger: typeof strictInteger
    strictNumber: typeof strictNumber
    strictObject: typeof strictObject
} = {
    strictArray: strictArray,
    strictBoolean: strictBoolean,
    strictBooleanLike: strictBooleanLike,
    strictDate: strictDate,
    strictEnum: strictEnum,
    strictInteger: strictInteger,
    strictNumber: strictNumber,
    strictObject: strictObject,
}

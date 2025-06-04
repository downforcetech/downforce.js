import {strictArray} from '../array/array-strict.js'
import {strictBoolean, strictBooleanLike} from '../boolean/boolean-strict.js'
import {strictDate} from '../date/date-strict.js'
import {strictEnum} from '../enum/enum-strict.js'
import {strictInteger, strictIntegerLike, strictNumber, strictNumberLike} from '../number/number-strict.js'
import {strictObject} from '../object/object-strict.js'
import {strictString, strictStringLike, strictStringNotEmpty} from '../string/string-strict.js'

export const TypeStrict: {
    strictArray: typeof strictArray
    strictBoolean: typeof strictBoolean
    strictBooleanLike: typeof strictBooleanLike
    strictDate: typeof strictDate
    strictEnum: typeof strictEnum
    strictInteger: typeof strictInteger
    strictIntegerLike: typeof strictIntegerLike
    strictNumber: typeof strictNumber
    strictNumberLike: typeof strictNumberLike
    strictObject: typeof strictObject
    strictString: typeof strictString
    strictStringLike: typeof strictStringLike
    strictStringNotEmpty: typeof strictStringNotEmpty
} = {
    strictArray: strictArray,
    strictBoolean: strictBoolean,
    strictBooleanLike: strictBooleanLike,
    strictDate: strictDate,
    strictEnum: strictEnum,
    strictInteger: strictInteger,
    strictIntegerLike: strictIntegerLike,
    strictNumber: strictNumber,
    strictNumberLike: strictNumberLike,
    strictObject: strictObject,
    strictString: strictString,
    strictStringLike: strictStringLike,
    strictStringNotEmpty: strictStringNotEmpty,
}

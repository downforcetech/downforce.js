import {trustArray} from '../array/array-trust.js'
import {trustBoolean, trustBooleanLike} from '../boolean/boolean-trust.js'
import {trustDate} from '../date/date-trust.js'
import {trustEnum} from '../enum/enum-trust.js'
import {trustInteger, trustIntegerLike, trustNumber, trustNumberLike} from '../number/number-trust.js'
import {trustObject} from '../object/object-trust.js'
import {trustString, trustStringLike, trustStringNotEmpty} from '../string/string-trust.js'

export const TypeTrust: {
    trustArray: typeof trustArray
    trustBoolean: typeof trustBoolean
    trustBooleanLike: typeof trustBooleanLike
    trustDate: typeof trustDate
    trustEnum: typeof trustEnum
    trustInteger: typeof trustInteger
    trustIntegerLike: typeof trustIntegerLike
    trustNumber: typeof trustNumber
    trustNumberLike: typeof trustNumberLike
    trustObject: typeof trustObject
    trustString: typeof trustString
    trustStringLike: typeof trustStringLike
    trustStringNotEmpty: typeof trustStringNotEmpty
} = {
    trustArray: trustArray,
    trustBoolean: trustBoolean,
    trustBooleanLike: trustBooleanLike,
    trustDate: trustDate,
    trustEnum: trustEnum,
    trustInteger: trustInteger,
    trustIntegerLike: trustIntegerLike,
    trustNumber: trustNumber,
    trustNumberLike: trustNumberLike,
    trustObject: trustObject,
    trustString: trustString,
    trustStringLike: trustStringLike,
    trustStringNotEmpty: trustStringNotEmpty,
}

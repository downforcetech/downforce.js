import {areArraysEqual} from '../array/array-equal.js'
import {areObjectsEqualShallow, areObjectsEqualShallowStrict} from '../object/object-equal.js'
import {areEqualDeepSerializable, areEqualDeepStrict, areEqual} from '../value/value-equal.js'

export const TypeEqual: {
    areArraysEqual: typeof areArraysEqual
    areEqual: typeof areEqual
    areEqualDeepSerializable: typeof areEqualDeepSerializable
    areEqualDeepStrict: typeof areEqualDeepStrict
    areObjectsEqualShallow: typeof areObjectsEqualShallow
    areObjectsEqualShallowStrict: typeof areObjectsEqualShallowStrict
} = {
    areArraysEqual: areArraysEqual,
    areEqual: areEqual,
    areEqualDeepSerializable: areEqualDeepSerializable,
    areEqualDeepStrict: areEqualDeepStrict,
    areObjectsEqualShallow: areObjectsEqualShallow,
    areObjectsEqualShallowStrict: areObjectsEqualShallowStrict,
}

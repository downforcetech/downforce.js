import {areArraysEqual} from '../array/array-equal.js'
import {areObjectsEqualShallow, areObjectsEqualShallowStrict} from '../object/object-equal.js'
import {areEqualDeepSerializable, areEqualIdentity} from '../struct/struct-equal.js'

export const TypeEqual: {
    areArraysEqual: typeof areArraysEqual
    areEqualDeepSerializable: typeof areEqualDeepSerializable
    areEqualIdentity: typeof areEqualIdentity
    areObjectsEqualShallow: typeof areObjectsEqualShallow
    areObjectsEqualShallowStrict: typeof areObjectsEqualShallowStrict
} = {
    areArraysEqual: areArraysEqual,
    areEqualDeepSerializable: areEqualDeepSerializable,
    areEqualIdentity: areEqualIdentity,
    areObjectsEqualShallow: areObjectsEqualShallow,
    areObjectsEqualShallowStrict: areObjectsEqualShallowStrict,
}

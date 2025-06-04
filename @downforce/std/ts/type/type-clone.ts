import {cloneDate} from '../date/date-clone.js'
import {cloneObjectShallow} from '../object/object-clone.js'
import {clonePromise} from '../promise/promise-clone.js'
import {cloneDeep, cloneDeepSerializable, cloneShallow} from '../struct.js'

export const TypeClone: {
    cloneDate: typeof cloneDate
    cloneDeep: typeof cloneDeep
    cloneDeepSerializable: typeof cloneDeepSerializable
    cloneObjectShallow: typeof cloneObjectShallow
    clonePromise: typeof clonePromise
    cloneShallow: typeof cloneShallow
} = {
    cloneDate: cloneDate,
    cloneDeep: cloneDeep,
    cloneDeepSerializable: cloneDeepSerializable,
    cloneObjectShallow: cloneObjectShallow,
    clonePromise: clonePromise,
    cloneShallow: cloneShallow,
}

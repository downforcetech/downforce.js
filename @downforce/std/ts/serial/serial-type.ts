import type {ObjectPath} from '../object/object-path.js'

// Types ///////////////////////////////////////////////////////////////////////

export type SerialCodecId = number | string
export type SerialStackEntry = [SerialCodecId, ObjectPath]

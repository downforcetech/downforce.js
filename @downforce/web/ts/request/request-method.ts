import {Enum, type UnionOf} from '@downforce/std/enum'
import type {StringAutocomplete} from '@downforce/std/type'

export const RequestMethodEnum: {
    Delete: 'DELETE'
    Get: 'GET'
    Patch: 'PATCH'
    Post: 'POST'
    Put: 'PUT'
} = Enum({
    Delete: 'DELETE',
    Get: 'GET',
    Patch: 'PATCH', // Patch must be uppercase, otherwise fetch() fails.
    Post: 'POST',
    Put: 'PUT',
})

// Types ///////////////////////////////////////////////////////////////////////

export type RequestMethodEnumType = UnionOf<typeof RequestMethodEnum> | StringAutocomplete

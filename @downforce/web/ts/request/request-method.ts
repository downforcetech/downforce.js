import type {StringAutocompleted, ValueOf} from '@downforce/std/type'

export const RequestMethod = {
    Delete: 'DELETE' as const,
    Get: 'GET' as const,
    Patch: 'PATCH' as const, // Patch must be uppercase, otherwise fetch() fails.
    Post: 'POST' as const,
    Put: 'PUT' as const,
}

// Types ///////////////////////////////////////////////////////////////////////

export type RequestMethodEnum = (ValueOf<typeof RequestMethod>) | StringAutocompleted

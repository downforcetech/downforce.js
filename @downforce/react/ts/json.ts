import {useMemo} from 'react'

export function useJson<T = unknown>(stringJson: string):
    | [data: T, error: undefined]
    | [data: undefined, error: unknown]
export function useJson<T = unknown>(stringJson: undefined | string):
    | [data: T, error: undefined]
    | [data: undefined | T, error: undefined]
    | [data: undefined, error: unknown]
export function useJson<T = unknown>(stringJson: undefined | string):
    | [data: T, error: undefined]
    | [data: undefined | T, error: undefined]
    | [data: undefined, error: unknown]
{
    return useMemo(() => {
        if (! stringJson) {
            return [undefined, undefined]
        }

        try {
            return [JSON.parse(stringJson) as T, undefined]
        }
        catch (error) {
            return [undefined, error]
        }
    }, [stringJson])
}

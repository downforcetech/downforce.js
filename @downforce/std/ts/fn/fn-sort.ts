import type {FnArgs} from './fn-type.js'

export const SortCollatorOptionsDefaults: Intl.CollatorOptions = {
    numeric: true, // '1' < '2' < '10'.
}

export function SortComparator(
    options?: undefined | Intl.CollatorOptions,
    localeOptions?: undefined | Intl.LocalesArgument,
): Intl.Collator {
    return new Intl.Collator(localeOptions, {...SortCollatorOptionsDefaults, ...options})
}

/*
* EXAMPLE
*
* const list = [{id: 1, name: 'Mike'}, {id: 2, name: 'John'}]
* list.sort(sortBy(it => it.id))
* list.sort(sortBy(it => it.name))
*/
export function sortBy<I, R extends undefined | number | string>(
    getItemValue: (item: I) => R,
    collatorOptional?: undefined | Intl.Collator | Intl.CollatorOptions,
    localeOptions?: undefined | Intl.LocalesArgument,
): (first: I, second: I) => number {
    const collator = collatorOptional instanceof Intl.Collator
        ? collatorOptional
        : SortComparator(collatorOptional, localeOptions)

    function sort(first: I, second: I): number {
        return collator.compare(
            String(getItemValue(first) ?? ''),
            String(getItemValue(second) ?? ''),
        )
    }

    return sort
}

/*
* EXAMPLE
*
* const list = [{id: 1, name: 'Mike'}]
* list.sort(invertSort(sortBy(it => it.id)))
*/
export function invertSort<A extends FnArgs>(
    fn: (...args: A) => number,
): (...args: A) => number {
    function invertFn(...args: A) {
        return invert(fn(...args))
    }

    return invertFn
}

export function invert(result: number): number {
    return -1 * result
}

/*
* EXAMPLE
*
* const list = [{id: 1, name: 'Mike'}, {id: 2, name: 'John'}]
* list.sort(composeSorts(invertSort(sortById), sortBy(it => it.name)))
*/
export function composeSorts<I>(...comparators: Array<(first: I, second: I) => number>): (first: I, second: I) => number {
    function sort(first: I, second: I): number {
        for (const comparator of comparators) {
            const result = comparator(first, second)

            if (result === 0) {
                // 0
                continue
            }
            // -1/1
            return result
        }
        return 0
    }

    return sort
}

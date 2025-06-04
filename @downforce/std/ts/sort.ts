import type {FnArgs} from './fn.js'

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
* list.sort(combineSort(sortById, sortByName))
* list.sort(combineSort(sorted(it => it.id), sorted(it => it.name)))
*/
export function combineSort<I>(...comparators: Array<(first: I, second: I) => number>): (first: I, second: I) => number {
    function sort(first: I, second: I): number {
        for (const comparator of comparators) {
            const result = comparator(first, second)

            if (! result) {
                // 0.
                continue
            }
            return result // 1/-1.
        }
        return 0
    }

    return sort
}

/*
* EXAMPLE
*
* const list = [{id: 1, name: 'Mike'}, {id: 2, name: 'John'}]
* list.sort(sorted(it => it.id))
* list.sort(sorted(it => it.name))
*/
export function sorted<I, R extends undefined | number | string>(
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
* list.sort(inverting(sorted(it => it.id)))
*/
export function inverting<A extends FnArgs>(
    fn: (...args: A) => number,
): (...args: A) => number {
    function onInvert(...args: A) {
        return invert(fn(...args))
    }

    return onInvert
}

export function invert(result: number): number {
    return -1 * result
}

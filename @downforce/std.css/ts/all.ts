import {classes} from '@downforce/web/classes'

export function stdAttrs(options: StdCssAttributesOptions): Record<string, string> {
    return {}
}

export function stdClass(options: StdCssClassesOptions): string {
    return classes(stdClasses(options))
}

export function stdClasses(options: StdCssClassesOptions): Array<string> {
    return []
}

export const StdCssSdk = {
    createStdClassEncoder(separator: string): StdClassEncoder<string> {
        function encode(key: string, value: undefined | number | string): undefined | string {
            return StdCssSdk.encodeStdClass(key, value, separator)
        }

        return encode
    },
    encodeStdClass(key: string, value: undefined | number | string, separator: string): undefined | string {
        if (! value) {
            return
        }
        return `${key}-${value}`
    },
    encodeStdClassBoolean(key: string, value: undefined | boolean): undefined | string {
        return classes({[key]: value})
    },
}

export const StdClassesEncoders: {
    'std-TODO-boolean': StdClassEncoder<boolean>
    'std-TODO-string': StdClassEncoder<string>
} = {
    'std-TODO-boolean': StdCssSdk.encodeStdClassBoolean,
    'std-TODO-string': StdCssSdk.createStdClassEncoder(''),
}

// Types ///////////////////////////////////////////////////////////////////////

export type StdCssAttributesOptions = {} // TODO
export type StdCssClassesOptions = {[key in keyof typeof StdClassesEncoders]: Parameters<typeof StdClassesEncoders[key]>[1]}

export type StdClassEncoder<V> = (key: string, value: undefined | V) => undefined | string

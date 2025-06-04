export function escapeRegexp(string: string): string {
    // if (RegExp.escape) {
    //     return RegExp.escape(string)
    // }
    return string.replace(/[.*+?^${}[\]()|\\]/g, '\\$&')
}

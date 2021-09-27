 // @ts-ignore
import BabelPresetReact from '@babel/preset-react' // @ts-ignore
import BabelPresetTypescript from '@babel/preset-typescript' // @ts-ignore
import BabelPluginSyntaxDynamicImport from '@babel/plugin-syntax-dynamic-import' // @ts-ignore
import BabelPluginProposalNullishCoalescingOperator from '@babel/plugin-proposal-nullish-coalescing-operator' // @ts-ignore
import BabelPluginProposalNumericSeparator from '@babel/plugin-proposal-numeric-separator' // @ts-ignore
import BabelPluginProposalOptionalChaining from '@babel/plugin-proposal-optional-chaining'

export default createBabelConfig()

export function createBabelConfig(options?: BabelConfigOptions) {
    // const mode = options?.mode ?? process.env.NODE_ENV
    // const workDir = options?.workDir ?? process.cwd()
    // const isProductionMode = mode === 'production'

    return {
        presets: [
            [BabelPresetReact, {
                'runtime': 'automatic', // React 17.
                'importSource': 'react', // React 17.
                'useSpread': true, // Uses the native spread operator.
            }],
            [BabelPresetTypescript, {
                isTSX: true,
                allExtensions: true,
            }],
        ],
        plugins: [
            // Language Features ///////////////////////////////////////////////////
            BabelPluginSyntaxDynamicImport, // import()
            BabelPluginProposalNullishCoalescingOperator, // STANDARD: a?.b ?? c
            BabelPluginProposalNumericSeparator, // STAGE 4: 1_000_000
            BabelPluginProposalOptionalChaining, // STANDARD: a?.b?.c?.()?.[1]
        ],
    }
}

// Types ///////////////////////////////////////////////////////////////////////

export interface BabelConfigOptions {
    mode?: undefined | string
    workDir?: undefined | string
}

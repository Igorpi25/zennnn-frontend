import analyze from 'rollup-plugin-analyzer'
import ts from 'rollup-plugin-typescript2'

const outputConfigs = {
  esm: {
    file: 'lib/index.esm.js',
    format: 'es',
    plugins: [analyze({ summaryOnly: true })],
  },
  cjs: {
    file: 'lib/index.cjs.js',
    format: 'cjs',
  },
}

const packageConfigs = ['esm', 'cjs'].map(format => createConfig(format, outputConfigs[format]))

export default packageConfigs

function createConfig (format, output, plugins = []) {
  if (!output) {
    console.log(require('chalk').yellow(`invalid format: "${format}"`))
    process.exit(1)
  }

  const tsPlugin = ts({
    check: false,
    tsconfig: './tsconfig.dist.json',
    cacheRoot: './node_modules/.rts2_cache',
    tsconfigOverride: {
      compilerOptions: {
        sourceMap: false,
        declaration: false,
      },
    },
  })

  const external = [
    'vue',
    'vue-router',
    'vue-supp',
    'vue-i18n',
    '@zennnn/icons',
    '@popperjs/core',
    'date-fns',
  ]

  const nodePlugins = [
    require('@rollup/plugin-node-resolve').nodeResolve({
      preferBuiltins: true,
    }),
    require('@rollup/plugin-commonjs')({
      sourceMap: false,
    }),
    require('rollup-plugin-node-builtins')(),
    require('rollup-plugin-node-globals')(),
  ]

  if (format !== 'cjs') {
    external.push('lodash-es')
  }

  return {
    input: './src/index.ts',
    external,
    plugins: [
      tsPlugin,
      ...nodePlugins,
      ...plugins,
    ],
    output,
    treeshake: {
      moduleSideEffects: false,
    },
  }
}

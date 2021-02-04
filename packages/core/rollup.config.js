import analyze from 'rollup-plugin-analyzer'
import postcss from 'rollup-plugin-postcss'

const outputConfigs = {
  esm: {
    file: 'lib/index.esm.js',
    format: 'es',
    plugins: [analyze({ summaryOnly: true })],
  },
  cjs: {
    file: 'lib/index.cjs.js',
    format: 'cjs'
  },
}

const packageConfigs = ['esm', 'cjs'].map(format => createConfig(format, outputConfigs[format]))

export default packageConfigs

function createConfig (format, output, plugins = []) {
  if (!output) {
    console.log(require('chalk').yellow(`invalid format: "${format}"`))
    process.exit(1)
  }

  const external = [
    'vue',
    'vue-router',
    'vue-supp',
    '@zennnn/icons',
  ]

  const nodePlugins = [
    require('@rollup/plugin-node-resolve').nodeResolve({
      preferBuiltins: true
    }),
    require('@rollup/plugin-commonjs')({
      sourceMap: false
    }),
    require('rollup-plugin-node-builtins')(),
    require('rollup-plugin-node-globals')(),
  ]

  if (format !== 'cjs') {
    nodePlugins.push(
      postcss({
        config: {
            path: './postcss.config.js',
        },
        extensions: ['.css'],
        extract: true,
      })
    )
  } else {
    nodePlugins.push(
      postcss({
        config: {
            path: './postcss.config.js',
        },
        extensions: ['.css'],
        extract: false,
      })
    )
  }

  return {
    input: './src/index.js',
    external,
    plugins: [
      ...nodePlugins,
      ...plugins,
    ],
    output,
    treeshake: {
      moduleSideEffects: false,
    },
  }
}

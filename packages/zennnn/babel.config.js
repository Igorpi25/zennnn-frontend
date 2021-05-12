const base = require('../../babel.config.js')

module.exports = {
  ...base,
  plugins: [
    [
      'import',
      {
        libraryName: '@zennnn/core',
        libraryDirectory: 'lib/components',
        style: false,
        camel2DashComponentName: false,
      },
    ],
  ],
}

module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      '@vue/babel-plugin-jsx',
      {
        transformOn: true,
      },
    ],
    [
      'import',
      {
        libraryName: '@zennnn/core',
        style: false,
        camel2DashComponentName: false,
        customName: (name) => {
          const componentsPath = '@zennnn/core/lib/components'
          if (name === 'MenuItem') {
            return `${componentsPath}/Menu/MenuItem`
          }
          if (name === 'WindowItem') {
            return `${componentsPath}/Window/WindowItem`
          }
          return `${componentsPath}/${name}`
        },
      },
    ],
  ],
}

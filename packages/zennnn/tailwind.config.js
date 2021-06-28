const base = require('../../tailwind.config.js')
const aspectRatioPlugin = require('@tailwindcss/aspect-ratio')

module.exports = {
  ...base,
  purge: [
    './public/index.html',
    './src/**/*.{vue,js,ts,jsx,tsx,md}',
    '../shared/**/*.{ts,tsx}',
    '../../node_modules/@zennnn/core/lib/components/**/*.js',
    '../../node_modules/@zennnn/core/lib/composables/**/*.js',
  ],
  theme: {
    ...base.theme,
    extend: {
      ...base.theme.extend,
      fontFamily: {
        myriad: ['MyriadPro', 'sans-serif'],
        'myriad-cond': ['MyriadPro-Cond', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      stroke: {
        white: '#ffffff',
      },
    },
  },
  plugins: [...base.plugins, aspectRatioPlugin],
}

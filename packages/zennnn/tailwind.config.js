const base = require('../../tailwind.config.js')

module.exports = {
  ...base,
  purge: {
    mode: 'layers',
    layers: ['utilities'],
    content: [
      './src/**/*.html',
      './src/**/*.{vue,js,ts,jsx,tsx,md}',
      '../core/lib/components/**/*.js',
      '../core/lib/composables/**/*.js',
    ],
  },
  theme: {
    ...base.theme,
    fontFamily: {
      myriad: ['MyriadPro', 'sans-serif'],
      'myriad-cond': ['MyriadPro-Cond', 'sans-serif'],
      montserrat: ['Montserrat', 'sans-serif'],
    },
  },
}

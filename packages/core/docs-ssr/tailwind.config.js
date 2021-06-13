const base = require('../tailwind.config')

module.exports = {
  ...base,
  purge: [
    './docs-ssr/index.html',
    './docs-ssr/src/**/*.{vue,js,ts,jsx,tsx,md}',
    './playground/src/**/*.{vue,js,ts,jsx,tsx,md}',
    './src/**/*.{vue,js,ts,jsx,tsx,md}',
  ],
}

const base = require('../../tailwind.config.js')

module.exports = {
  ...base,
  purge: ['./src/**/*.{vue,js,ts,jsx,tsx,md}'],
}

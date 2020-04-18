module.exports = {
  theme: {
    container: {
      center: true,
    },
    colors: {
      primary: '#5a8199',
      'primary-accent': '#6996B2',
      secondary: '#16a0ce',
      accent1: 'var(--base-accent1)',
      accent2: 'var(--base-accent2)',
      accent3: 'var(--base-accent3)',
      black: '#000000',
      'chaos-black': '#0F0F0F',
      white: '#ffffff',
      'gray-lightest': '#9F9F9F',
      'gray-lighter': '#868686',
      'gray-light': '#777777',
      gray: '#393939',
      'gray-dark': '#545454',
      'gray-darker': '#303132',
      'gray-darkest': '#2A2B2D',
      'logo-mobile': '#CACACA',
      'logo-desktop': '#1E0E00',
      error: '#c4321d',
      red: '#BF3A40',
      green: '#48BB78',
      orange: '#fb8c00',
      transparent: 'transparent',
      'gray-50': '#F7F7F7',
      'gray-75': '#E4E4E4',
      'gray-100': '#AAAAAA',
      'gray-200': '#676767', // IN_DRAFT
      'gray-300': '#585858',
      'gray-400': '#404040',
      'gray-500': '#353535',
      'gray-600': '#2F2F2F',
      'gray-700': '#282828',
      'gray-800': '#222222',
      'gray-900': '#1E1E1E',
      'blue-400': '#2F80ED',
      'blue-500': '#7E99D0', // primary color
      'blue-600': '#5C78B1', // primary hover color
      'pink-500': '#FF005E', // error, IN_PROCESSING
      'green-500': '#08DC1B', // success, IN_STOCK
      'yellow-500': '#FDB600', // warning, IN_PRODUCTION
      'red-500': '#FF212D',
    },
    fontFamily: {
      'myriad': ['MyriadPro', 'sans-serif'],
      'myriad-cond': ['MyriadPro-Cond', 'sans-serif'],
    },
    boxShadow: {
      primary: '0 0 0 1px #5a8199',
      'blue-500': '0 0 0 1px #7E99D0',
      default: '0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px 0 rgba(0, 0, 0, .06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, .1), 0 2px 4px -1px rgba(0, 0, 0, .06)',
      lg: '0px 4px 10px rgba(0, 0, 0, 0.25)',
    },
    extend: {
      spacing: {
        '2px': '2px',
        'xs': '2px',
        'sm': '10px',
        'lg': '30px',
        '9': '2.25rem',
      },
      height: {
        '9': '2.25rem',
      },
      opacity: {
        '35': '.35',
      },
    },
  },
  variants: {},
  plugins: [],
}

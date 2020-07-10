module.exports = {
  purge: [
    './src/**/*.html',
    './src/**/*.vue',
    './src/**/*.jsx',
    './src/components/Base/*.js',
  ],
  theme: {
    container: {
      center: true,
    },
    colors: {
      primary: '#5a8199',
      'gray-lighter': '#868686',
      'gray-light': '#777777',
      gray: '#393939',
      'gray-dark': '#545454',
      'gray-darkest': '#2A2B2D',
      error: '#c4321d',
      red: '#BF3A40',
      green: '#48BB78',
      orange: '#fb8c00',
      black: '#000000',
      white: '#ffffff',
      transparent: 'transparent',
      current: 'currentColor',
      'gray-10': '#F0F0F0',
      'gray-50': '#F7F7F7',
      'gray-75': '#E4E4E4',
      'gray-100': '#AAAAAA',
      'gray-140': '#828282', // used in landing
      'gray-150': '#878787', // used in landing
      'gray-200': '#676767', // IN_DRAFT
      'gray-300': '#585858',
      'gray-400': '#404040',
      'gray-500': '#353535',
      'gray-600': '#2F2F2F',
      'gray-700': '#282828',
      'gray-800': '#232323',
      'gray-900': '#1E1E1E',
      'blue-400': '#2F80ED',
      'blue-500': '#7E99D0', // primary color
      'blue-600': '#5C78B1', // primary hover color
      'blue-700': '#345DEE', // landing color
      'blue-800': '#2F52D4', // landing hover color
      'blue-900': '#4C51BF', // custom price color
      'pink-500': '#FF005E', // error, IN_PROCESSING
      'pink-600': '#E00052',
      'purple-500': '#EF20E6',
      'green-400': '#13F626',
      'green-500': '#08DC1B', // success, IN_STOCK
      'green-600': '#07C517',
      'yellow-300': '#EAD377', // input warning
      'yellow-400': '#D7C370', // checkbox error text
      'yellow-500': '#FDB600', // warning, IN_PRODUCTION
      'red-500': '#FF212D',
      'red-600': '#FF121F', // spec total client debt text
      'red-900': '#3D242D', // error color
    },
    fontFamily: {
      myriad: ['MyriadPro', 'sans-serif'],
      'myriad-cond': ['MyriadPro-Cond', 'sans-serif'],
      montserrat: ['Montserrat', 'sans-serif'],
    },
    boxShadow: {
      'gray-75': '0 0 0 1px #E4E4E4',
      'blue-500': '0 0 0 1px #7E99D0',
      'blue-600': '0 0 0 1px #5C78B1',
      'yellow-300': '0 0 0 1px #EAD377',
      default: '0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px 0 rgba(0, 0, 0, .06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, .1), 0 2px 4px -1px rgba(0, 0, 0, .06)',
      lg: '0px 4px 10px rgba(0, 0, 0, 0.25)',
    },
    letterSpacing: {
      tight: '-.025em',
      normal: '0',
      wide: '.025em',
      wider: '.05em',
      widest: '.15em',
    },
    extend: {
      fontSize: {
        28: '28px',
        32: '32px',
        40: '40px',
        56: '56px',
      },
      spacing: {
        xs: '2px',
        sm: '10px',
        md: '14px',
        lg: '30px',
        7: '1.75rem',
        9: '2.25rem',
        11: '2.75rem',
        13: '3.25rem',
        14: '3.5rem',
        18: '4.5rem',
        26: '6.5rem',
        36: '9rem',
        38: '9.5rem',
      },
      opacity: {
        10: '.1',
        20: '.2',
        30: '.3',
        35: '.35',
        40: '.4',
        90: '.9',
      },
      zIndex: {
        1: '1',
        2: '2',
      },
      transitionProperty: {
        'colors-and-opacity': 'background-color, border-color, color, fill, stroke, opacity',
      },
      borderRadius: {
        20: '20px',
        50: '50px',
      },
      inset: {
        '1/2': '50%',
      },
    },
  },
  variants: {
    backgroundColor: ['responsive', 'hover', 'focus', 'focus-within', 'even'],
    borderColor: ['responsive', 'hover', 'focus', 'focus-within'],
    boxShadow: ['responsive', 'hover', 'focus', 'focus-within'],
    overflow: ['responsive', 'hover'],
    visibility: ['group-hover'],
  },
  plugins: [],
}

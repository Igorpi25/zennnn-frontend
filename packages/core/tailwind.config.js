const plugin = require('tailwindcss/plugin')

// Removed from v2 'scrolling-touch' and 'scrolling-auto' utilities
// Added with plugin, for use it in '@apply'
const scrollingTouchUtilities = plugin(function ({ addUtilities }) {
  const newUtilities = {
    '.scrolling-touch': {
      '-webkit-overflow-scrolling': 'touch',
    },
    '.scrolling-auto': {
      '-webkit-overflow-scrolling': 'auto',
    },
  }

  addUtilities(newUtilities)
})

module.exports = {
  darkMode: 'class',
  purge: {
    mode: 'layers',
    layers: ['utilities'],
    content: [
      './index.html',
      './src/**/*.vue',
      './src/**/*.md',
      './src/**/*.js',
      './src/**/*.ts',
      './docs/.vitepress/theme/**/*.vue',
      './docs/.vitepress/examples/**/*.vue',
    ],
  },
  theme: {
    container: false,
    screens: {
      'xs': '420px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    },
    colors: {
      black: '#000000',
      white: '#ffffff',
      transparent: 'transparent',
      current: 'currentColor',
      'light-gray': {
        100: '#F7F7F7',
        200: '#F4F4F4',
        300: '#F0F0F0',
        400: '#E4E4E4',
        500: '#E0E0E0',
        600: '#C4C4C4',
        700: '#BDBDBD',
        800: '#878787',
        900: '#828282',
      },
      gray: {
        100: '#AAAAAA',
        200: '#676767', // IN_DRAFT
        300: '#585858',
        400: '#404040',
        500: '#353535',
        600: '#2F2F2F',
        650: '#2A2A2A',
        700: '#282828',
        800: '#232323',
        900: '#1E1E1E',
      },
      blue: {
        400: '#83BBEE', // primary hover color
        500: '#5BAAF0', // primary color
        550: '#549EDE', // primary active color
        600: '#0476FF',
        800: '#4634B0',
        900: '#4C51BF', // custom price color
      },
      'cold-blue': {
        400: '#2F80ED', // shipped color
        500: '#345DEE', // landing color
        600: '#2F52D4', // landing hover color
      },
      pink: {
        500: '#FF005E', // error, IN_PROCESSING
        600: '#E00052',
      },
      purple: {
        500: '#EF20E6',
      },
      green: {
        400: '#13F626',
        500: '#08DC1B', // success, IN_STOCK
        600: '#07C517',
      },
      yellow: {
        300: '#EAD377', // input warning
        400: '#D7C370', // checkbox error text
        500: '#FDB600', // warning, IN_PRODUCTION
      },
      red: {
        // 500: '#FF212D',
        // 600: '#FF121F', // spec total client debt text
        500: '#FF005E', // TODO: *-pink-500 replace with *-red-500
        600: '#E62828',
        700: '#BE0000',
        900: '#3D242D', // error color
      },
    },
    boxShadow: {
      'main-night': '0px 20px 40px rgba(0, 0, 0, 0.35)',
      'main-day': '0px 20px 40px rgba(0, 0, 0, 0.1)',
      'photo': '4px 4px 8px rgba(0, 0, 0, 0.15)',
      'inner-pressed': 'inset 0px 2px 1px rgba(0, 0, 0, 0.7)',
      'small-forms-night': '0px 0px 10px rgba(0, 0, 0, 0.25)',
      'small-form-day': '0px 0px 10px rgba(0, 0, 0, 0.05)',

      DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px 0 rgba(0, 0, 0, .06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, .1), 0 2px 4px -1px rgba(0, 0, 0, .06)',
      lg: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      xl: '0px 0px 20px rgba(0, 0, 0, 0.1)',
      // drop-shadow(0px 0px 15px rgba(0, 0, 0, 0.25)); // comment right menu shadow
      '2xl': '0px 4px 30px 0 rgba(0, 0, 0, 0.15)', // tooltip and menu shadows (light)
      '3xl': '0px 4px 30px 0 rgba(0, 0, 0, 0.25)', // tooltip and menu shadows
      '4xl': '6px 6px 60px 0 rgba(0, 0, 0, 0.16)', // image preview menu shadow (light)
      '5xl': '0px 4px 120px 0 rgba(0, 0, 0, 0.5)', // image preview menu shadow?
      1: '0 2px 1px -1px rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 1px 3px 0 rgba(0,0,0,.12)',
      2: '0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)',
      3: '0 3px 3px -2px rgba(0,0,0,.2),0 3px 4px 0 rgba(0,0,0,.14),0 1px 8px 0 rgba(0,0,0,.12)',
      4: '0 2px 4px -1px rgba(0,0,0,.2),0 4px 5px 0 rgba(0,0,0,.14),0 1px 10px 0 rgba(0,0,0,.12)',
      5: '0 3px 5px -1px rgba(0,0,0,.2),0 5px 8px 0 rgba(0,0,0,.14),0 1px 14px 0 rgba(0,0,0,.12)',
      6: '0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12)',
      7: '0 4px 5px -2px rgba(0,0,0,.2),0 7px 10px 1px rgba(0,0,0,.14),0 2px 16px 1px rgba(0,0,0,.12)',
      8: '0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)',
      24: '9 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12)',
      none: 'none',
    },
    gradientColorStops: {
      'gray-900': 'rgba(30, 30, 30, 1)',
      'gray-900-a-0': 'rgba(30, 30, 30, 0)',
      'gray-900-a-50': 'rgba(30, 30, 30, 0.5)',
    },
    extend: {
      keyframes: {
        shake: {
          'from, to': { transform: 'translate3d(0, 0, 0)' },
          '59%': { transform: 'translate3d(0, 0, 0)' },
          '60%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '70%, 90%': { transform: 'translate3d(-2px, 0, 0)' },
        },
      },
      animation: {
        shake: 'shake .6s cubic-bezier(0.25, 0.8, 0.5, 1)',
      },
      fontSize: {
        13: '13px',
        28: '28px',
        32: '32px',
        40: '40px',
        56: '56px',
      },
      spacing: {
        xs: '2px',
        sm: '10px',
        md: '14px',
        lg: '18px',
        xl: '30px',
        7: '1.75rem',
        9: '2.25rem',
        11: '2.75rem',
        13: '3.25rem',
        14: '3.5rem',
        15: '3.75rem',
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
        80: '.8',
        90: '.9',
      },
      zIndex: {
        1: '1',
        2: '2',
      },
      transitionProperty: {
        color: 'color',
        'bg-and-color': 'background-color, color',
        'colors-and-opacity': 'background-color, border-color, color, fill, stroke, opacity',
        'padding-bottom': 'padding-bottom',
      },
      transitionTimingFunction: {
        'out-quart': 'cubic-bezier(0.25, 0.8, 0.5, 1)',
      },
      borderRadius: {
        3: '3px',
        20: '20px',
        50: '50px',
      },
      inset: {
        '1/2': '50%',
      },
      gridTemplateColumns: {
        // Complex site-specific column configuration
        '2-264': 'repeat(2, 264px)',
        '3-264': 'repeat(3, 264px)',
        '4-264': 'repeat(4, 264px)',
      },
    },
  },
  variants: {
    cursor: ['responsive', 'disabled'],
    fontWeight: ['responsive', 'hover', 'focus', 'dark'],
    backgroundColor: ['responsive', 'hover', 'focus', 'disabled', 'dark', 'even', 'active'],
    borderColor: ['responsive', 'hover', 'focus', 'disabled', 'dark', 'active'],
    boxShadow: ['responsive', 'hover', 'focus', 'dark'],
    cursor: ['responsive', 'disabled'],
    opacity: ['responsive', 'group-hover', 'focus-within', 'hover', 'focus', 'disabled'],
    overflow: ['responsive', 'hover'],
    visibility: ['group-hover'],
    ringOffsetColor: ['responsive', 'dark', 'focus-within', 'focus', 'dark'],
    translate: ['responsive', 'hover', 'focus', 'group-hover'],
    textColor: ['responsive', 'hover', 'focus', 'group-hover', 'disabled', 'dark', 'active'],
  },
  plugins: [
    scrollingTouchUtilities,
  ],
}

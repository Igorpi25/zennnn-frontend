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
      './src/**/*.html',
      './src/**/*.{vue,js,ts,jsx,tsx}',
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
        50: '#FCFCFC',
        100: '#F8F8F8',
        200: '#F4F4F4',
        300: '#F0F0F0',
        400: '#E4E4E4',
        500: '#E0E0E0',
        550: '#DADADA',
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
    gradientColorStops: {
      'gray-900': 'rgba(30, 30, 30, 1)',
      'gray-900-a-0': 'rgba(30, 30, 30, 0)',
      'gray-900-a-50': 'rgba(30, 30, 30, 0.5)',
    },
    extend: {
      letterSpacing: {
        widest: '.15em',
      },
      boxShadow: {
        'main-night': '0px 20px 40px rgba(0, 0, 0, 0.35)',
        'main-day': '0px 20px 40px rgba(0, 0, 0, 0.1)',
        'photo': '4px 4px 8px rgba(0, 0, 0, 0.15)',
        'inner-pressed-night': 'inset 0px 2px 1px rgba(0, 0, 0, 0.7)',
        'inner-pressed-day': 'inset 0px 2px 1px rgba(0, 0, 0, 0.2)',
        'small-forms-night': '0px 0px 10px rgba(0, 0, 0, 0.25)',
        'small-form-day': '0px 0px 10px rgba(0, 0, 0, 0.05)',
      },
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
        xs: '2px', // - 0.5: '0.125rem'
        sm: '10px', // - 2.5: '0.625rem'
        md: '14px', // - 3.5: '0.875rem'
        lg: '18px', // + 4.5: '1.125rem'
        xl: '30px', // + 7.5: '1.875rem'
        7: '1.75rem', // -
        9: '2.25rem', // -
        11: '2.75rem', // -
        13: '3.25rem', // +
        14: '3.5rem', // -
        15: '3.75rem', // +
        18: '4.5rem', // +
        26: '6.5rem', // +
        36: '9rem', // -
        38: '9.5rem', // +
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
        20: '20px',
        50: '50px',
      },
      inset: {
        '1/2': '50%', // -
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
    backgroundColor: ['responsive', 'dark', 'group-hover', 'focus-within', 'hover', 'focus', 'disabled', 'even', 'active'],
    borderColor: ['responsive', 'dark', 'group-hover', 'focus-within', 'hover', 'focus', 'disabled', 'active'],
    boxShadow: ['responsive', 'group-hover', 'focus-within', 'hover', 'focus', 'dark'],
    cursor: ['responsive', 'disabled'],
    fontWeight: ['responsive', 'hover', 'focus', 'dark'],
    opacity: ['responsive', 'group-hover', 'focus-within', 'hover', 'focus', 'disabled'],
    overflow: ['responsive', 'hover'],
    textColor: ['responsive', 'dark', 'group-hover', 'focus-within', 'hover', 'focus', 'disabled', 'active'],
    translate: ['responsive', 'hover', 'focus', 'group-hover'],
    visibility: ['responsive', 'group-hover'],
  },
  plugins: [
    scrollingTouchUtilities,
  ],
}

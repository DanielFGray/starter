/* eslint-disable */
const colors = require('tailwindcss/colors')

module.exports = {
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        'light-blue': colors.lightBlue,
        'blue-gray': colors.blueGray,
        'gray': colors.trueGray,
      },
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}

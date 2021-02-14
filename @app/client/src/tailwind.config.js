const colors = require("tailwindcss/colors")

module.exports = {
  darkMode: "media",
  theme: {
    colors: {
      "lightBlue": colors.lightBlue,
      "blueGray": colors.blueGray,
      "coolGray": colors.coolGray,
      "gray": colors.trueGray,
    },
  },
  variants: {},
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
  ],
}

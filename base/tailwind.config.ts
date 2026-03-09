import type { Config } from 'tailwindcss'
const defaultTheme = require('tailwindcss/defaultTheme')

export default <Partial<Config>>{
  theme: {
    extend: {
      fontFamily: {
        'sans': ["SourceSansPro", ...defaultTheme.fontFamily.sans],
      },
    }
  }
}


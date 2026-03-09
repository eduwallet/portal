import type { Config } from 'tailwindcss'
const plugin = require('tailwindcss/plugin')

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        yellow: {
          '50': '#fdfbe9',
          '100': '#fcf5d4',
          '200': '#f8eb90',
          '300': '#f4d74b',
          '400': '#f4d74b',
          '500': '#f4d74b',
          '600': '#c1850d',
          '700': '#9a5f0e',
          '800': '#7f4c14',
          '900': '#6c3e17',
          '950': '#3f1f09',
        },
        green: {
          '50': '#ebfef6',
          '100': '#cceee6',
          '200': '#a4f6d4',
          '300': '#6aebbe',
          '400': '#00af81',
          '500': '#00af81',
          '600': '#00af81',
          '700': '#007c5f',
          '800': '#03624c',
          '900': '#045040',
          '950': '#012d25',
        },
        blue: {
          '50': '#f0f4fe',
          '100': '#d6e2fd',
          '200': '#c2d3fb',
          '300': '#98b8f8',
          '400': '#6894f2',
          '500': '#3d68ec',
          '600': '#2252e4',
          '700': '#2252e4',
          '800': '#2252e4',
          '900': '#2252e4',
          '950': '#2252e4',
        },
        red: {
          '50': '#fef2f3',
          '100': '#ffe1e5',
          '200': '#ffc9cf',
          '300': '#fea3ae',
          '400': '#db1f35',
          '500': '#db1f35',
          '600': '#db1f35',
          '700': '#bc192c',
          '800': '#9c1827',
          '900': '#811b27',
          '950': '#460910',
        },
        orange: {
          '50': '#fcf5f0',
          '100': '#ff34d8',
          '200': '#f2cdb6',
          '300': '#e9ac88',
          '400': '#dd784b',
          '500': '#dd784b',
          '600': '#ca4c2c',
          '700': '#a83a26',
          '800': '#863026',
          '900': '#6d2a21',
          '950': '#3a1310',
        },
        pink: {
          '50': '#fbf5f6',
          '100': '#faeaea',
          '200': '#f4d9dc',
          '300': '#f4d9dc',
          '400': '#f4d9dc',
          '500': '#f4d9dc',
          '600': '#b54d59',
          '700': '#973e48',
          '800': '#7e363e',
          '900': '#6a3238',
          '950': '#38171b',
        },
        magenta: {
          '50': '#fdf2fa',
          '100': '#fce7f8',
          '200': '#fad0f1',
          '300': '#f7aae5',
          '400': '#f175d1',
          '500': '#bd1c82',
          '600': '#bd1c82',
          '700': '#bd1c82',
          '800': '#bd1c82',
          '900': '#bd1c82',
          '950': '#bd1c82',
        },
        demo: {
          text: '#83201BCC',
          bg: '#FFD03A',
          icon: '#FFC100'
        },
      },
      maxWidth: {
        '1/2': '50%',
        '2/3': '67%',
      },
    }
  },
  plugins: [
    plugin(function ({ addBase, theme }: { addBase: (base: Record<string, any>) => void, theme: (path: string) => string }) {
      addBase({
        'h1': {
          paddingTop: theme('padding.8'),
          paddingBottom: theme('padding.8'),
          fontSize: '2.5rem',
          fontWeight: theme('fontWeight.semibold'),
          color: theme('colors.green.900')
        },
        'h2': {
          fontSize: theme('fontSize.3xl'),
          fontWeight: theme('fontWeight.semibold'),
          color: theme('colors.green.900'),
          marginBottom: theme('margin.5')
        },
        'h3': {
          fontSize: theme('fontSize.2xl'),
          fontWeight: theme('fontWeight.semibold'),
          color: theme('colors.green.900'),
        },
        'h4': {
          fontSize: theme('fontSize.2xl'),
          fontWeight: theme('fontWeight.semibold'),
          color: theme('colors.gray.900'),
        }
      })
    })
  ]
}

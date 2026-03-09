// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-03-17',
  devtools: { enabled: false },
  $meta: {
    name: 'base',
  },
  nitro: {
    preset: 'node-server'
  },
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/fonts',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-svgo',
    '@nuxtjs/i18n',
    '@surf/nuxt-base/modules/memory-guardian/module'
  ],
  runtimeConfig: {
    apiToken: 'secret',
    public: {
      piniaPluginPersistedstate: {
        cookieOptions: {
          domain: process.env.NUXT_PUBLIC_DEPLOYMENT_COOKIEDOMAIN,
        }
      },
    },
  },
  colorMode: {
    preference: 'light'
  },
  i18n: {
    lazy: true,
    locales: [
      {
        code: 'en',
        language: 'en-US',
        file: 'en.json',
      },
      {
        code: 'nl',
        language: 'nl-NL',
        file: 'nl.json',
      },
    ],
    defaultLocale: 'nl',
    strategy: 'prefix_except_default'
  },
})

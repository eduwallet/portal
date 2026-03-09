export default defineNuxtConfig({
  extends: '@surf/nuxt-base',
  compatibilityDate: '2025-03-17',
  modules: [
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxt/fonts',
    'pinia-plugin-persistedstate/nuxt',
    'nuxt-svgo',
    '@nuxtjs/i18n',
    'nuxt-oidc-auth',
  ],
  ui: {
    safelistColors: ['primary', 'green'],
  },
  runtimeConfig: {
    public: {
      appType: 'portal',
      appName: 'portal',
    },
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
    strategy: 'prefix_except_default',
    compilation: {
      strictMessage: false,
    },
    bundle: {
      optimizeTranslationDirective: false,
    },
  },
  oidc: {
    defaultProvider: 'oidc',
    providers: {
      oidc: {
        baseUrl: '',
        clientId: process.env.NUXT_OIDC_PROVIDERS_OIDC_CLIENT_ID || '',
        redirectUri: process.env.NUXT_OIDC_PROVIDERS_OIDC_REDIRECT_URI || 'https://portal.dev.eduwallet.nl/auth/oidc/callback',
        clientSecret: process.env.NUXT_OIDC_PROVIDERS_OIDC_CLIENT_SECRET || '',
        authorizationUrl: process.env.NUXT_OIDC_PROVIDERS_OIDC_AUTHORIZATION_URL || 'https://connect.test.surfconext.nl/oidc/authorize',
        tokenUrl: process.env.NUXT_OIDC_PROVIDERS_OIDC_TOKEN_URL || 'https://connect.test.surfconext.nl/oidc/token',
        openIdConfiguration: process.env.NUXT_OIDC_PROVIDERS_OIDC_OPENID_CONFIGURATION || 'https://connect.test.surfconext.nl/.well-known/openid-configuration',
        responseType: 'code',
        authenticationScheme: 'header',
        grantType: 'authorization_code',
        pkce: false,
        state: true,
        nonce: false,
        scope: ['openid', 'profile', 'email'],
        userNameClaim: 'preferred_username',
        filterUserInfo: ['email'],
        scopeInTokenRequest: true,
        tokenRequestType: 'form-urlencoded',
        requiredProperties: [
          'clientId',
          'redirectUri',
          'clientSecret',
          'authorizationUrl',
          'tokenUrl',
        ],
        optionalClaims: [
          'email',
          'given_name',
          'family_name',
          'edumember_is_member_of'
        ],
        validateAccessToken: true,
        validateIdToken: true,
        skipAccessTokenParsing: false,
        exposeAccessToken: false,
        exposeIdToken: true,
        callbackRedirectUrl: '/',
        allowedClientAuthParameters: undefined,
        logoutUrl: '',
        sessionConfiguration: undefined,
        additionalAuthParameters: undefined,
        additionalLogoutParameters: undefined,
        excludeOfflineScopeFromTokenRequest: false,
      },
    },
    session: {
      expirationCheck: true,
      automaticRefresh: true,
      expirationThreshold: 3600,
    },
    middleware: {
      globalMiddlewareEnabled: true,
      customLoginPage: true,
    },
    devMode: {
      enabled: false,
      generateAccessToken: true,
      userName: 'Test User',
      userInfo: { providerName: 'test' },
      claims: { customclaim01: 'foo', customclaim02: 'bar' },
      issuer: 'dev-issuer',
      audience: 'dev-app',
      subject: 'dev-user',
    },
  },

  nitro: {
    preset: 'node-server',
    storage: {
      oidc: {
        driver: 'fs',
        base: process.env.NUXT_OIDC_STORAGE_FOLDER || 'oidcstorage',
      },
    },
  },
  app: {
    head: {
      link: [
        // Basic favicon
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        
        // Standard sizes
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        
        // Apple devices
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        
        // Android devices  
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-chrome-192x192.png' },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/android-chrome-512x512.png' },
        
        // Web App Manifest
        { rel: 'manifest', href: '/site.webmanifest' }
      ],
    }
  },
});

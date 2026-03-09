import { defineNuxtModule, addPlugin, addServerPlugin, createResolver } from '@nuxt/kit'

export default defineNuxtModule({
  meta: {
    name: 'memory-guardian',
    version: '1.0.0',
    configKey: 'memoryGuardian'
  },
  defaults: {
    server: true,
  },

  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    if (options.server) {
      addServerPlugin(resolve('./runtime/server/plugin'))
      nuxt.options.serverMiddleware = nuxt.options.serverMiddleware || []
    }
  },
})

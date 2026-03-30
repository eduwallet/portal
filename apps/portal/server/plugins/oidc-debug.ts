export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    if (event.path.startsWith('/auth')) {
      console.log('[oidc req]', event.path, getHeaders(event))
    }
  })
})
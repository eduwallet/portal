export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('request', (event) => {
    if (event.path.startsWith('/auth')) {
      console.log('[oidc req]', event.path, getHeaders(event))
    }
    if (event.path.startsWith('/auth/oidc/callback')) {
        // After token exchange, log the JWT header to see kid + iss
        // Grab the id_token from the exchange response if you have it
        console.log(JSON.stringify(event.context, null, 2))
        const idToken = event.context.oidcTokens?.idToken  // may vary
        if (idToken) {
            const [headerB64, , payloadB64] = idToken.split('.')
            const header = JSON.parse(Buffer.from(headerB64, 'base64url').toString())
            const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString())
            console.log('[oidc debug] JWT header:', header)        // kid, alg
            console.log('[oidc debug] JWT iss:', payload.iss)     // actual issuer
        }
    }
  })
})
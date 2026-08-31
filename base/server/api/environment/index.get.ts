export default defineEventHandler(() => { 
    return [
        {
            key: 'apiBaseUrl',
            value: process.env.NUXT_PUBLIC_API_BASE_URL || '',
        },
        {
            key: 'imageBaseUrl',
            value: process.env.NUXT_PUBLIC_IMAGE_BASE_URL || '',
        },
        {
            key: 'issuerBaseUrl',
            value: process.env.NUXT_PUBLIC_ISSUER_BASE_URL || '',
        },
        {
            key: 'verifierBaseUrl',
            value: process.env.NUXT_PUBLIC_VERIFIER_BASE_URL || '',
        },
        {
            key: 'deploymentStage',
            value: process.env.NUXT_PUBLIC_DEPLOYMENT_STAGE || '',
        },
    ];
});

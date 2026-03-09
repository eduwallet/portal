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
            key: 'agentBaseUrl',
            value: process.env.NUXT_PUBLIC_AGENT_BASE_URL || '',
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

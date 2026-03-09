import { makeId } from '../../utils/credential-offer';
import { GetVerifiablePresentationBackendResponse } from './types';

export default defineEventHandler(async () => {
    try {
        const verifierToken = process.env.NUXT_VERIFIER_TOKEN || '';
        const verifierBaseUrl = process.env.NUXT_PUBLIC_VERIFIER_BASE_URL || '';

        const response: GetVerifiablePresentationBackendResponse = await $fetch(
            `${verifierBaseUrl}/sandbox/api/create-offer/EEC`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${verifierToken}`,
                },
            },
        );

        const id = makeId(16)
        const { requestUri, checkUri } = response;

        const storage = useStorage();
        
        await storage.setItem(`fs:${id}.json`, {
            requestUri,
            checkUri,
        });
    
        return {
            id,
            requestUri,
        }
    } catch(error: unknown) {
        console.log(error)
        throw createError({
            statusCode: 500,
            statusMessage: '_notifications.error.api.failed_to_create_credential_offer',
            data: error,
        });
    }
});
  
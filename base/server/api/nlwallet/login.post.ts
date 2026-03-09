import { GetVerifiablePresentationBackendResponse } from './types';

export default defineEventHandler(async () => {
    try {
        const response: GetVerifiablePresentationBackendResponse = await $fetch(
            `https://rp.edi.${process.env.NUXT_PUBLIC_DEPLOYMENT_STAGE || ''}.eduwallet.nl/sessions`,
            {
                method: 'POST',
                body: {
                    "usecase": "xyz_bank",
                    "return_url_template": "https://myapp/callback?token={session_token}",
                    "items": [
                        {
                            "docType": "urn:eudi:pid:nl:1",
                            "nameSpaces": {
                                "urn:eudi:pid:nl:1": {
                                    "bsn": true,
                                }
                            }
                        }
                    ]
                },
            },
        );

        const { session_url: checkUri, session_token: id } = response;
        const qrResponse: { request_object_by_reference: string } = await $fetch(checkUri);
        const requestUri = qrResponse.request_object_by_reference

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
  
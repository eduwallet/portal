import { createCredentialOffer } from '../../../../base/server/utils/credential-offer'
  
export default defineEventHandler(async (event) => {
    try {
        return await createCredentialOffer(event);
    } catch(error: unknown) {
        console.log(error)
        throw createError({
            statusCode: 500,
            statusMessage: '_notifications.error.api.failed_to_create_credential_offer',
            data: error,
        });
    }
});
  
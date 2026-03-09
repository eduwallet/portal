import { CreateOfferResponse, CreateOfferBackendResponse } from '.';

interface EntitlementCredentialOfferBody {
    entitlement: string;
}

export const createAuthorizationCodeFlowEntitlementCredentialOffer = async (body: EntitlementCredentialOfferBody): Promise<Omit<CreateOfferResponse, 'pin'>> => {
    const { entitlement } = body;

    if (!entitlement) {
        throw new Error('Field entitlement is required');
    }

    const issuerToken = process.env.NUXT_EDUID_ISSUER_TOKEN || '';
    const agentBaseUrl = process.env.NUXT_PUBLIC_EDUID_ISSUER_BASE_URL || '';

    const response: CreateOfferBackendResponse = await $fetch(`${agentBaseUrl}/api/create-offer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${issuerToken}`,
        },
        body: {
            credentials: ['entitlement'],
            grants: {
                authorization_code: {
                    issuer_state: 'generate',
                },
            },
            credentialDataSupplierInput: {
                entitlements: [
                    entitlement,
                ]
            },
        }
    });

    return {
        qr_id: String(response.id),
        qr_uri: response.uri,
    }
};

import { CreateOfferResponse, CreateOfferBackendResponse, makeId } from '.';

interface SupportCredentialOfferBody {
    agentPrefix: string;
    issuer: string;
    title: string;
    name: string;
    institutionShortcode: string;
    validFrom: string;
    validUntil: string;
}

export const createSupportCredentialOffer = async (body: SupportCredentialOfferBody): Promise<CreateOfferResponse> => {
    const { agentPrefix, issuer, title, validFrom, validUntil, name, institutionShortcode } = body;

    if (!agentPrefix || !issuer || !title || !name || !institutionShortcode || !validFrom || !validUntil) {
        throw new Error('Fields agentPrefix, issuer, title, name, institutionShortcode, validFrom and validUntil are required');
    }

    const issuerToken = process.env.NUXT_ISSUER_TOKEN || '';
    const agentBaseUrl = process.env.NUXT_PUBLIC_AGENT_BASE_URL || '';

    const response: CreateOfferBackendResponse = await $fetch(`${agentBaseUrl}/${agentPrefix}/api/create-offer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${issuerToken}`,
        },
        body: {
            'credentials': ['SupportCredential'],
            'grants': {
                'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
                    'pre-authorized_code': makeId(16)
                },
            },
            'credentialDataSupplierInput': {
                "_ttl": "31536000",
                "issuer": issuer,
                "title": title,
                "name": name,
                "institution_shortcode": institutionShortcode,
                "valid_from": validFrom,
                "valid_until": validUntil,
            },
        }
    });

    return {
        qr_id: String(response.id),
        qr_uri: response.uri,
        pin: String(response.txCode),
    }
};

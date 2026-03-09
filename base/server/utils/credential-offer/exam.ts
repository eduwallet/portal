import { Support } from '@surf/nuxt-base/server/api/support/types';
import { CreateOfferResponse, CreateOfferBackendResponse, makeId } from '.';

interface ExamCredentialOfferBody {
    agentPrefix: string;
    title: string;
    code: string;
    eduId: string;
    support: Support[];
}

export const createExamCredentialOffer = async (body: ExamCredentialOfferBody): Promise<CreateOfferResponse> => {
    const { agentPrefix, title, code, eduId, support } = body;

    if (!agentPrefix || !title || !code || !eduId || !support) {
        throw new Error('Fields agentPrefix, title, code, eduId and support are required');
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
            'credentials': ['ExamEnrollmentCredential'],
            'grants': {
                'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
                    'pre-authorized_code': makeId(16)
                },
            },
            'credentialDataSupplierInput': {
                "_ttl": "31536000",
                "title": title,
                "code": code,
                "eduId": eduId,
                "support": support
            },
        }
    });

    return {
        qr_id: String(response.id),
        qr_uri: response.uri,
        pin: String(response.txCode),
    }
};

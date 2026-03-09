import { Program } from '@surf/nuxt-base/server/api/programs/types';
import { CreateOfferResponse, CreateOfferBackendResponse, makeId } from '.';

interface EnrollmentCredentialOfferBody {
    agentPrefix: string;
    program: Program;
    startDate: string;
    endDate: string;
}

export const createEnrollmentCredentialOffer = async (body: EnrollmentCredentialOfferBody): Promise<CreateOfferResponse> => {
    const { agentPrefix, program, startDate, endDate } = body;

    if (!agentPrefix || !program || !startDate || !endDate) {
        throw new Error('Fields agentPrefix, program, startDate and endDate are required');
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
            'credentials': ['AcademicEnrollmentCredential'],
            'grants': {
                'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
                    'pre-authorized_code': makeId(16)
                },
            },
            'credentialDataSupplierInput': {
                "_ttl": "31536000",
                "crohoCreboCode": program.id, // @todo program.programme_id
                "name": program.name,
                "phase": program.phase,
                "modeOfStudy": program.modeof,
                "startDate": startDate,
                "endDate": endDate,
                "institutionBRINCode": program.id.split('.')[0],
            },
        }
    });

    return {
        qr_id: String(response.id),
        qr_uri: response.uri,
        pin: String(response.txCode),
    }
};

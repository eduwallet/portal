import { CreateOfferResponse, CreateOfferBackendResponse, makeId } from '.';

interface StudydataCredentialOfferBody {
    agentPrefix: string;
    academicYear: string;
    program: string;
    role: string;
    mode: string;
    studentNumber: string;
}

export const createStudydataCredentialOffer = async (body: StudydataCredentialOfferBody): Promise<CreateOfferResponse> => {
    const {
        agentPrefix,
        academicYear,
        program,
        role,
        mode,
        studentNumber,
    } = body;

    if (!agentPrefix || !academicYear || !program || !role || !mode || !studentNumber) {
        throw new Error('Fields academicYear, program, role, mode and studentNumber are required');
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
            'credentials': ['StudyDataCredential'],
            'grants': {
                'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
                    'pre-authorized_code': makeId(16)
                },
            },
            'credentialDataSupplierInput': {
                "_ttl": "31536000",
                academic_year: academicYear,
                program: program,
                role: role,
                mode: mode,
                student_number: studentNumber,
            },
        }
    });

    return {
        qr_id: String(response.id),
        qr_uri: response.uri,
        pin: String(response.txCode),
    }
};

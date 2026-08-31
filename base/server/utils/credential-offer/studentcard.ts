import { CreateOfferResponse, CreateOfferBackendResponse, getIssuerBaseUrl, makeId } from '.';

interface StudentcardCredentialOfferBody {
    agentPrefix: string;
    name: string;
    email: string;
    studentNumber: string;
    institution: string;
}

export const createStudentcardCredentialOffer = async (body: StudentcardCredentialOfferBody): Promise<CreateOfferResponse> => {
    const { agentPrefix, name, email, studentNumber, institution } = body;

    if (!agentPrefix || !name || !email || !studentNumber || !institution) {
        throw new Error('Fields agentPrefix, name, email, student_number and institution are required');
    }

    const issuerToken = process.env.NUXT_ISSUER_TOKEN || '';
    const issuerBaseUrl = getIssuerBaseUrl(agentPrefix);

    const response: CreateOfferBackendResponse = await $fetch(`${issuerBaseUrl}/api/create-offer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${issuerToken}`,
        },
        body: {
            'credentials': ['StudentCardCredential'],
            'grants': {
                'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
                    'pre-authorized_code': makeId(16),
                },
            },
            'credentialDataSupplierInput': {
                "_ttl": "31536000",
                "name": name,
                "email": email,
                "student_number": studentNumber,
                "institution": institution,
            },
        }
    });

    return {
        qr_id: String(response.id),
        qr_uri: response.uri,
        pin: String(response.txCode),
    }
};

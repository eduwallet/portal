import { Persona } from '~/server/api/personas/types';
import { CreateOfferResponse, CreateOfferBackendResponse, makeId } from '.';

interface EduIdCredentialOfferBody {
    agentPrefix: string;
    email: string;
    sho: string;
    persona: Persona;
}

export const createEduIdCredentialOffer = async (body: EduIdCredentialOfferBody): Promise<CreateOfferResponse> => {
    const { agentPrefix, persona } = body;

    if (!agentPrefix || !persona) {
        throw new Error('Fields agentPrefix, persona are required');
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
            'credentials': ['EduID'],
            'grants': {
                'urn:ietf:params:oauth:grant-type:pre-authorized_code': {
                    'pre-authorized_code': makeId(16),
                },
            },
            'credentialDataSupplierInput': {
                'sub': persona._ID,
                'eduperson_unique_id': persona.eduPersonUniqueId,
                'given_name': persona.GivenName,
                'family_name': persona.Surname,
                'name': persona.displayName,
                'schac_home_organisation': persona.schacHomeOrganization,
                'email': persona.PrivateEmailAddress,
                'eduperson_affiliation': JSON.stringify(persona.eduPersonAffiliation),
                'eduperson_scoped_affiliation': JSON.stringify(persona.eduPersonScopedAffiliation),
                'eduperson_entitlement': JSON.stringify(persona.eduPersonEntitlement),
                'eduperson_assurance': JSON.stringify(persona.eduPersonAssurance)
            },
        }
    });

    return {
        qr_id: String(response.id),
        qr_uri: response.uri,
        pin: String(response.txCode),
    }
};

export const createAuthorizationCodeFlowEduIdCredentialOffer = async (body: EduIdCredentialOfferBody): Promise<Omit<CreateOfferResponse, 'pin'>> => {
    const issuerToken = process.env.NUXT_EDUID_ISSUER_TOKEN || '';
    const agentBaseUrl = process.env.NUXT_PUBLIC_EDUID_ISSUER_BASE_URL || '';

    const response: CreateOfferBackendResponse = await $fetch(`${agentBaseUrl}/api/create-offer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${issuerToken}`,
        },
        body: {
            credentials: ['eduID'],
            grants: {
                authorization_code: {
                    issuer_state: 'generate',
                },
            },
            credentialDataSupplierInput: {},
        }
    });

    return {
        qr_id: String(response.id),
        qr_uri: response.uri,
    }
};

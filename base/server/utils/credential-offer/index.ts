import {
    createAuthorizationCodeFlowEduIdCredentialOffer,
    createEduIdCredentialOffer,
} from './edu-id';
import { createEnrollmentCredentialOffer } from './enrollment';
import { createExamCredentialOffer } from './exam';
import { createStudentcardCredentialOffer } from './studentcard';
import { createStudydataCredentialOffer } from './studydata';
import { createSupportCredentialOffer } from './support';
import { createResultCredentialOffer } from './result';
import { createAuthorizationCodeFlowEntitlementCredentialOffer } from './entitlement';

export interface CreateOfferResponse {
    qr_id: string;
    qr_uri: string;
    pin: string;
}

export interface CreateOfferBackendResponse {
    id: number | string;
    uri: string;
    txCode: number | string;
}

export const makeId = (length: number): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
    return Array.from({ length }, () =>
        characters.charAt(Math.floor(Math.random() * characters.length))
    ).join('');
};

export const createCredentialOffer = async (event: any): Promise<Partial<CreateOfferResponse>> => {
    const body = await readBody(event);
    const { credentialType } = body;

    switch (credentialType) {
        case 'eduId':
            return await createEduIdCredentialOffer(body);
        case 'eduIdAcf':
            return await createAuthorizationCodeFlowEduIdCredentialOffer(body);
        case 'entitlement':
            return await createAuthorizationCodeFlowEntitlementCredentialOffer(body);
        case 'enrollment':
            return await createEnrollmentCredentialOffer(body);
        case 'studentcard':
            return await createStudentcardCredentialOffer(body);
        case 'studydata':
            return await createStudydataCredentialOffer(body);
        case 'support':
            return await createSupportCredentialOffer(body);
        case 'exam':
            return await createExamCredentialOffer(body);
        case 'result':
            return await createResultCredentialOffer(body, event);
        default:
            throw new Error('Unsupported credential type');
    }
};
export interface Support {
    id: number;
    name: string;
    issuer?: string;
}

export interface GetVerifiablePresentationResponse {
    status: string;
    result: any;
}

export interface GetVerifiablePresentationBackendResponse {
    requestUri: string;
    checkUri: string;
}

export interface VerifiableCredentialStorage {
    requestUri: string;
    checkUri: string;
    code: string;
}

export interface SupportAddResponse {
    id: string;
    requestUri: string;
}

export interface SupportAddCheckResponse {
    status: string;
    personaId: string;
    support?: Support;
    result?: string;
}

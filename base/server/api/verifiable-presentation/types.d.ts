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

export interface VerifiablePresentationResponse {
    id: string;
    requestUri: string;
}

export interface VerifiablePresentationCheckResponse {
    status: string;
    result?: string;
}

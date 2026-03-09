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

export interface LoginResponse {
    id: string;
    requestUri: string;
}

export interface LoginCheckResponse {
    status: string;
    token?: string;
    result?: string;
}

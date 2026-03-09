export interface GetVerifiablePresentationResponse {
    status: string;
    result: any;
}

export interface GetVerifiablePresentationBackendResponse {
    session_url: string;
    session_token: string;
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
    pid?: string;
    requestUri?: string;
    result?: string;
}

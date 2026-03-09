export interface Course {
    id: string;
    type: string;
    name: string;
    edubadge: string;
    image: string;
    description: string;
    learning_outcome: string;
    language: string;
    studypoints: string;
    unit: string;
    croho_crebo: string;
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

export interface SignUpResponse {
    id: string;
    requestUri: string;
}

export interface SignUpCheckResponse {
    status: string;
    token?: string;
    result?: string;
}

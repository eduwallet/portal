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

export interface EdcResponse {
  id: string;
  requestUri: string;
}

export interface EdcCheckResponse {
  status: string;
  awardingBody: string;
  title: string;
  result?: string;
}

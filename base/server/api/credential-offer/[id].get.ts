import { getIssuerBaseUrl } from '../../utils/credential-offer';

interface Res {
  status: string;
  code?: string;
  createdAt: number;
  lastUpdatedAt: number;
  requests: Record<string, any>;
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { agentPrefix } = getQuery(event);
  const issuerToken = process.env.NUXT_ISSUER_TOKEN || '';
  const issuerBaseUrl = getIssuerBaseUrl(String(agentPrefix));

  try {
    const res: Res = await $fetch(`${issuerBaseUrl}/api/check-offer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${issuerToken}`,
      },
      body: { 'id': id }
    });

    return {
      status: res.status,
      credentialSubject: res.requests['get_credential-response_jwt']?.credentialSubject,
    }
  } catch (error: unknown) {
    console.log(error);

    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : '_notifications.error.api.server_error',
    });
  }
});

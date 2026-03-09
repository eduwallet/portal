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
  const agentBaseUrl = process.env.NUXT_PUBLIC_AGENT_BASE_URL || '';

  try {
    const res: Res = await $fetch(`${agentBaseUrl}/${agentPrefix}/api/check-offer`, {
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

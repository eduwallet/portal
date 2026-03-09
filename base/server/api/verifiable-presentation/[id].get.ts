import { VerifiableCredentialStorage } from './types';

interface Res {
  status: string;
  result: any;
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const storage = useStorage();
  const exists = await storage.hasItem(`fs:${id}.json`);

  if (!exists) {
    throw createError({
      statusCode: 404,
      statusMessage: '_notifications.error.api.auth.credential_not_found',
    });
  }

  try {
    const data = await storage.getItem<VerifiableCredentialStorage>(`fs:${id}.json`);

    const verifierToken = process.env.NUXT_VERIFIER_TOKEN || '';

    const res = await $fetch<Res>(data!.checkUri, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${verifierToken}`,
      },
    });

    if (res.status !== 'RESPONSE_RECEIVED') {
        return {
          status: res.status
        };
    }

    await storage.removeItem(`fs:${id}.json`);

    return {
      status: res.status,
      result: res.result,
    };
  } catch (error: unknown) {
    console.log(error);

    if ('statusMessage' in (error as object)) throw error;

    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : '_notifications.error.api.server_error',
    });
  }
})

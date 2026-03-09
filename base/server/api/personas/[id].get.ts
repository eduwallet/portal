import { Iam, Sis } from '../types';

interface Res {
    iam: Iam[];
    sis: Sis[];
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  const { institutionShortCode } = getQuery(event);

  const apiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL || '';

  const res: Res = await $fetch(`${apiBaseUrl}/${institutionShortCode || 'uvh'}.json`, {
    headers: { 'Content-Type': 'application/json' },
  });

  const persona = res.sis.find(sis => sis.BSN === id);

  if (!persona) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Persona not found'
    });
  }

  Object.assign(persona, res.sis.find(sis => sis._ID === persona?._ID) || {});

  return persona;
});

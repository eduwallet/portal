import { Iam, Sis } from '../types';

interface Res {
  iam: Iam[];
  sis: Sis[];
}

export default defineEventHandler(async (event) => {
  if (!event.context.auth) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }

  const apiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL || '';

  const res: Res = await $fetch(`${apiBaseUrl}/uvh.json`, {
    headers: { 'Content-Type': 'application/json' },
  });

  const persona = res.iam.find(iam => iam._ID === event.context.auth.personaId);

  if (!persona) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Persona not found'
    });
  }

  Object.assign(persona, res.sis.find(sis => sis._ID === persona?._ID) || {});

  return persona;
});

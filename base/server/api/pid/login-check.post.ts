import { VerifiableCredentialStorage } from './types';
import { Iam, Sis } from '../types';

interface Res {
  status: string;
  result: any;
}

interface PersonaRes {
  iam: Iam[];
  sis: Sis[];
}

const SECRET_KEY = process.env.JWT_SECRET || 'not-the-key';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const { id } = body;

  if (!id) {
    return {
      status: 'ERROR',
      result: '_notifications.error.api.pid.id_required',
    };
  }

  const storage = useStorage();

  const exists = await storage.hasItem(`fs:${id}.json`);

  if (!exists) {
    return {
      status: 'ERROR',
      result: '_notifications.error.api.pid.credential_not_found',
    };
  }

  try {
    const data = await storage.getItem<VerifiableCredentialStorage>(`fs:${id}.json`);

    const verifierToken = process.env.NUXT_VERIFIER_TOKEN || '';

    const res: Res = await $fetch(data!.checkUri, {
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

    const personalAdministrativeNumber = res.result.credentials.PID[0].claims.personal_administrative_number;

    if (!personalAdministrativeNumber) {
      return {
        status: 'ERROR',
        result: '_notifications.error.api.pid.no_pid_in_credential',
      };
    }

    const apiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL || '';

    const personaRes: PersonaRes = await $fetch(`${apiBaseUrl}/mbob.json`, {
      headers: { 'Content-Type': 'application/json' },
    });

    const persona = personaRes.sis.find(sis => sis.BSN === personalAdministrativeNumber);

    if (!persona) {
      return {
        status: 'ERROR',
        result: '_notifications.error.api.pid.persona_not_found',
      };
    }

    await storage.removeItem(`fs:${id}.json`);

    return {
      status: res.status,
      pid: personalAdministrativeNumber,
    };
  } catch (error: unknown) {
    console.log(error);

    if ('statusMessage' in error) throw error;

    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : '_notifications.error.api.server_error',
    });
  }
})

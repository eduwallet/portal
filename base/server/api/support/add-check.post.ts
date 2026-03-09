import { VerifiableCredentialStorage } from './types';
import jwt from 'jsonwebtoken'
import { Iam, Sis } from '../types';
import { fetchInstitutions } from '../institutions/index.get';
import { Institution } from '../institutions/types';

interface Res {
  status: string;
  result: any;
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id } = body;
  const registrationCookie = getCookie(event, 'registration');
  const registration = registrationCookie ? JSON.parse(decodeURIComponent(registrationCookie)) : null;
  const registeredPrograms = registration?.programs || [];
  const registeredCourses = registration?.courses || [];

  if (!id) {
    return {
      status: 'ERROR',
      result: '_notifications.error.api.auth.id_required',
    };
  }

  const storage = useStorage();

  const exists = await storage.hasItem(`fs:${id}.json`);

  if (!exists) {
    return {
      status: 'ERROR',
      result: '_notifications.error.api.auth.credential_not_found',
    };
  }

  try {
    const data = await storage.getItem<VerifiableCredentialStorage>(`fs:${id}.json`);

    const config = useRuntimeConfig();

    const verifierToken = process.env.NUXT_VERIFIER_TOKEN || '';
    const appName = config.public.appName as string;

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

    const supportName = res.result.credentials.SupportCredential[0].claims.name;
    const institutionShortcode = res.result.credentials.SupportCredential[0].claims.institution_shortcode;

    if (!supportName || ! institutionShortcode) {
      return {
        status: 'ERROR',
        result: '_notifications.error.api.auth.no_name_or_shortcode',
      };
    }

    if (appName.includes(institutionShortcode)) {
      return {
        status: 'ERROR',
        result: '_notifications.error.api.support.only_import_support_as_guest_student',
      };
    }

    const institutions = await fetchInstitutions();
    const institution = institutions.find((i: Institution) => appName.includes(i.shortcode));
    const institutionId = institution?.id || 'not-found';

    const personaId = event.context.auth.personaId;

    const enrolledPrograms = registeredPrograms.filter(p => p.personaId === personaId);
    const enrolledCourses = registeredCourses.filter(c => c.personaId === personaId);

    const support = [
      ...enrolledPrograms.filter(p => p.programId.startsWith(institutionId)).flatMap(p => p.support),
      ...enrolledCourses.filter(c => c.courseId.startsWith(institutionId)).flatMap(c => c.support),
    ];

    if (support.find(s => s.name === supportName)) {
      return {
        status: 'ERROR',
        result: '_notifications.error.api.support.already_added',
      };
    }

    await storage.removeItem(`fs:${id}.json`);

    return {
      status: res.status,
      personaId,
      support: {
        name: supportName,
        issuer: institutionShortcode,
      }
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

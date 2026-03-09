import { VerifiableCredentialStorage } from './types';
import jwt from 'jsonwebtoken'
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

const generateToken = (personaId: string) => {
  return jwt.sign({ personaId }, SECRET_KEY, { expiresIn: '24h' })
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id, courseId } = body;
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

    const personaId = res.result.credentials.AcademicBaseCredential[0].claims.sub;

    if (!personaId) {
      return {
        status: 'ERROR',
        result: '_notifications.error.api.auth.no_persona_id_in_credential',
      };
    }

    const apiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL || '';

    const personaRes: PersonaRes = await $fetch(`${apiBaseUrl}/mbob.json`, {
      headers: { 'Content-Type': 'application/json' },
    });

    const persona = personaRes.iam.find(iam => iam._ID === personaId);

    if (!persona) {
      return {
        status: 'ERROR',
        result: '_notifications.error.api.auth.persona_not_found'
      };
    }

    const enrolledProgramIds = [
      ...new Set(registeredPrograms
        .filter((c: ProgramRegistration) => c.personaId === personaId)
        .map((c: ProgramRegistration) => c.programId)
      ),
    ];

    const enrolledCourseIds = [
      ...new Set(registeredCourses
        .filter((c: CourseRegistration) => c.personaId === personaId)
        .map((c: CourseRegistration) => c.courseId)
      ),
    ];

    const isAlreadySignedUpForCourse = enrolledProgramIds.some((programId: string) => courseId.startsWith(programId)) ||
      enrolledCourseIds.find((id: string) => id === courseId);

    if (isAlreadySignedUpForCourse) {
      return {
        status: 'ERROR',
        result: '_notifications.error.api.course.already_signed_up',
      };
    }

    await storage.removeItem(`fs:${id}.json`);

    const token = generateToken(personaId);

    return {
      status: res.status,
      token,
      personaId,
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

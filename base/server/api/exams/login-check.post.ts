import { VerifiableCredentialStorage } from './types';
import jwt from 'jsonwebtoken'
import { Support } from '../support/types';
import { fetchInstitutions } from '../institutions/index.get';
import { Institution } from '../institutions/types';
import { fetchCourses } from '../courses/index.get';
import { toExam } from '../../utils/courses/mapper';

interface Res {
  status: string;
  result: any;
}

const SECRET_KEY = process.env.JWT_SECRET || 'not-the-key';

const generateToken = (title: string, code: string, eduId: string, support: Support[]) => {
  return jwt.sign({ title, code, eduId, support }, SECRET_KEY, { expiresIn: '24h' });
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { id } = body;

  if (!id) {
    return {
      status: 'ERROR',
      result: '_notifications.error.api.exam.id_required',
    };
  }

  const storage = useStorage();

  const exists = await storage.hasItem(`fs:${id}.json`);

  if (!exists) {
    return {
      status: 'ERROR',
      result: '_notifications.error.api.exam.credential_not_found',
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

    const {
      title,
      code,
      eduId,
      support,
    } = res.result.credentials.ExamEnrollmentCredential[0].claims;

    if (!title || !code || !eduId) {
      return {
        status: 'ERROR',
        result: '_notifications.error.api.exam.credential_must_contain',
      };
    }

    const courses = await fetchCourses();
    const exam = courses.map(toExam).find(e => e.code === code);

    if (!exam) {
      return {
        status: 'ERROR',
        result: '_notifications.error.api.exam.exam_not_found'
      };
    }

    const config = useRuntimeConfig();
    const appName = config.public.appName as string;

    const institutions = await fetchInstitutions();
    const institution = institutions.find((i: Institution) => appName.includes(i.shortcode));
    const institutionId = institution?.id || 'not-found';

    if (!exam?.id.startsWith(institutionId)) {
      return {
        status: 'ERROR',
        result: '_notifications.error.api.exam.exam_not_in_institution',
      };
    }

    await storage.removeItem(`fs:${id}.json`);

    const token = generateToken(title, code, eduId, support);

    return {
      status: res.status,
      token,
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

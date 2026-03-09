import { Exam } from './types';
import { fetchInstitutions } from '../../institutions/index.get';
import { Institution } from '../../institutions/types';
import { fetchCourses } from '../../courses/index.get';
import { toExam } from '../../../utils/courses/mapper';

export default defineEventHandler(async (event) => {
  if (!event.context.auth) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }

  const config = useRuntimeConfig();

  const registrationCookie = getCookie(event, 'registration');
  const registration = registrationCookie ? JSON.parse(decodeURIComponent(registrationCookie)) : null;
  const registeredPrograms = registration?.programs || [];
  const registeredCourses = registration?.courses || [];

  const personaId = event.context.auth.personaId;

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

  const institutions = await fetchInstitutions();
  const institution = institutions.find((i: Institution) => (config.public.appName as string).includes(i.shortcode));
  const institutionId = institution?.id || 'not-found';

  const enrolledAtInstitutionProgramIds = enrolledProgramIds.filter(id => id.startsWith(institutionId));
  const enrolledAtInstitutionCourseIds = enrolledCourseIds.filter(id => id.startsWith(institutionId));

  const courses = await fetchCourses();

  return courses
    .map(toExam)
    .filter((exam: Exam) =>
      enrolledAtInstitutionProgramIds.includes(exam.id.split('.').slice(0, -1).join('.')) ||
      enrolledAtInstitutionCourseIds.includes(exam.id)
    );
});

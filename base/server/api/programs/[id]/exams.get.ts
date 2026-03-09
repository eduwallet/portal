import { toExam } from '../../../utils/courses/mapper';
import { fetchCourses } from '../../courses/index.get';
import { fetchPrograms } from '../index.get';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  const programs = await fetchPrograms();
  const program = programs.find(p => p.id === id);
  
  if (!program) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Exam not found'
    });
  }

  const courses = await fetchCourses();

  return courses.map(toExam).filter(e => e.id.startsWith(program.id));
})

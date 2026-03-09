import { fetchPrograms } from '../index.get';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  const programs = await fetchPrograms();
  const program = programs.find(p => p.id === id);
  
  if (!program) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Program not found'
    });
  }

  return program;
})

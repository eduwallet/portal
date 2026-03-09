import { fetchPrograms } from '../../programs/index.get';
import { fetchInstitutions } from '../index.get';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');

  const institutions = await fetchInstitutions();

  const institution = institutions.find(i => i.id === id);
  
  if (!institution) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Institution not found'
    });
  }

  const programs = await fetchPrograms();

  const institutionPrograms = programs.filter(p => p.id.startsWith(institution.id));

  return institutionPrograms;
})

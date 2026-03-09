import { Iam, Sis } from '../types';

interface Res {
    iam: Iam[];
    sis: Sis[];
}

export default defineEventHandler(async (event) => { 
    const { institutionShortCode } = getQuery(event);
    const apiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL || '';

    const res: Res = await $fetch(`${apiBaseUrl}/${institutionShortCode || 'uvh'}.json`, {
        headers: { 'Content-Type': 'application/json' },
    });

    return res.sis.map(student => ({
        ...student,
        ...res.iam.find(iam => iam._ID === student._ID),
    }));
})

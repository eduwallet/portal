import { Program } from './types';

export default defineEventHandler(async() => { 
    return await fetchPrograms();
})

export const fetchPrograms = async () => {
    const apiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL || '';

    try {
        const programs: Program[] = await $fetch(`${apiBaseUrl}/programmes.json`, {
            headers: { 'Content-Type': 'application/json' },
        });
        return programs;
    } catch {
        return [];
    }
};
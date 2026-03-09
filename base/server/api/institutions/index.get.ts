import { Institution } from './types';

export default defineEventHandler(async() => { 
    return await fetchInstitutions();
})

export const fetchInstitutions = async () => {
    const apiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL || '';

    try {
        const institutions: Institution[] = await $fetch(`${apiBaseUrl}/institutions.json`, {
            headers: { 'Content-Type': 'application/json' },
        });
        return institutions;
    } catch {
        return [];
    }
}
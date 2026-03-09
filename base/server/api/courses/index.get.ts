import { Course } from './types';

export default defineEventHandler(async() => { 
    return await fetchCourses();
})

export const fetchCourses = async () => {
    const apiBaseUrl = process.env.NUXT_PUBLIC_API_BASE_URL || '';

    try {
        const courses: Course[] = await $fetch(`${apiBaseUrl}/courses.json`, {
            headers: { 'Content-Type': 'application/json' },
        });
        return courses;
    } catch {
        return [];
    }
};
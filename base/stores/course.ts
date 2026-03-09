import { defineStore } from 'pinia';
import { useSessionStore } from '@surf/nuxt-base/stores/session';
import type { Course } from '@surf/nuxt-base/server/api/courses/types';

export const useCourseStore = defineStore('course', {
    state: () => ({
        courses: [] as Course[],
    }),
    getters: {
        getCourseById: (state) => (id: string): Course | undefined =>
            state.courses.find((e: Course) => e.id === id),
    },
    actions: {
        async fetchCourses() {
            const sessionStore = useSessionStore();

            try {
                this.courses = await $fetch<Course[]>('/api/courses', {
                    headers: {
                        Authorization: `Bearer ${sessionStore.token}`,
                    }
                });
            } catch (e) {
                this.courses = [];
            }
        },
    },
});

import { defineStore } from 'pinia';
import { useSessionStore } from '@surf/nuxt-base/stores/session';
import type { Exam } from '@surf/nuxt-base/server/api/me/exams/types';

export const useExamStore = defineStore('exam', {
    state: () => ({
        exams: [] as Exam[],
    }),
    getters: {
        getExamById: (state) => (id: string): Exam | undefined =>
            state.exams.find((e: Exam) => e.id === id || e.code === id),
    },
    actions: {
        async fetchExams() {
            const sessionStore = useSessionStore();

            try {
                this.exams = await $fetch<Exam[]>('/api/me/exams', {
                    headers: {
                        Authorization: `Bearer ${sessionStore.token}`,
                    }
                });
            } catch (e) {
                this.exams = [];
            }
        },
    },
});
